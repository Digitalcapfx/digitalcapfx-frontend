import { NextRequest, NextResponse } from 'next/server';

const getAccountTypeFromToken = (token: string): string | null => {
    try {
        const payloadPart = token.split('.')[1];
        const decoded = Buffer.from(payloadPart, 'base64').toString('utf-8');
        const payload = JSON.parse(decoded);
        return payload?.account_type || null;
    } catch (e) {
        return null;
    }
};

export async function POST(request: NextRequest) {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
        return NextResponse.json({ success: false, error: 'BACKEND_API_URL not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { endpoint, method = 'GET', body: reqBody, headers = {} } = body;

        if (!endpoint) {
            return NextResponse.json({ success: false, error: 'Missing endpoint' }, { status: 400 });
        }

        // Clean slash combinations
        const cleanedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        const targetUrl = `${backendUrl}/${cleanedEndpoint}`;

        // Prepare headers to forward to backend
        const forwardHeaders = new Headers();
        forwardHeaders.set('Content-Type', 'application/json');

        // Copy incoming headers from proxy call body
        Object.entries(headers).forEach(([key, val]) => {
            if (val) forwardHeaders.set(key, String(val));
        });

        // Set Bearer token from cookies if not already specified
        let cookieToken = request.cookies.get('noe_token')?.value;
        if (cookieToken && !forwardHeaders.has('Authorization')) {
            forwardHeaders.set('Authorization', `Bearer ${cookieToken}`);
        }

        const fetchBody = reqBody ? JSON.stringify(reqBody) : undefined;
        console.log(`[API PROXY] ${method} ${targetUrl}`);

        let response = await fetch(targetUrl, {
            method: method.toUpperCase(),
            headers: forwardHeaders,
            body: fetchBody,
        });

        const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register') || endpoint.includes('/auth/token/refresh');
        let newAccessToken: string | null = null;
        let newRefreshToken: string | null = null;
        let didRefresh = false;

        // Perform token refresh rotation if 401 occurs on non-login/register endpoints
        if (response.status === 401 && !isAuthEndpoint) {
            const refreshToken = request.cookies.get('noe_refresh_token')?.value;
            console.log(`[API PROXY REFRESH DEBUG] 401 Unauthorized received for endpoint: "${endpoint}"`);
            console.log(`[API PROXY REFRESH DEBUG] Existing 'noe_refresh_token' cookie present: ${Boolean(refreshToken)} (${refreshToken ? `${refreshToken.slice(0, 12)}...` : 'NONE'})`);

            if (refreshToken) {
                console.log(`[API PROXY REFRESH DEBUG] Triggering token refresh call to: ${backendUrl}/auth/token/refresh`);
                try {
                    const refreshRes = await fetch(`${backendUrl}/auth/token/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            refresh_token: refreshToken,
                            refreshToken: refreshToken,
                        }),
                    });

                    const refreshText = await refreshRes.text();
                    console.log(`[API PROXY REFRESH DEBUG] Refresh endpoint HTTP status: ${refreshRes.status} ${refreshRes.statusText}`);
                    console.log(`[API PROXY REFRESH DEBUG] Raw Refresh Response Body: ${refreshText}`);

                    let refreshData: any;
                    try {
                        refreshData = JSON.parse(refreshText);
                    } catch (e) {
                        refreshData = null;
                    }

                    if (refreshRes.status >= 200 && refreshRes.status < 300 && refreshData) {
                        const dataObj = refreshData?.data || refreshData;

                        newAccessToken =
                            dataObj?.access_token ||
                            dataObj?.accessToken ||
                            dataObj?.token ||
                            refreshData?.access_token ||
                            refreshData?.accessToken ||
                            refreshData?.token ||
                            null;

                        newRefreshToken =
                            dataObj?.refresh_token ||
                            dataObj?.refreshToken ||
                            refreshData?.refresh_token ||
                            refreshData?.refreshToken ||
                            refreshToken;

                        console.log(`[API PROXY REFRESH DEBUG] Destructured newAccessToken: ${newAccessToken ? `${newAccessToken.slice(0, 15)}...` : 'NULL/UNDEFINED'}`);
                        console.log(`[API PROXY REFRESH DEBUG] Destructured newRefreshToken: ${newRefreshToken ? `${newRefreshToken.slice(0, 15)}...` : 'NULL/UNDEFINED'}`);

                        if (newAccessToken) {
                            didRefresh = true;
                            console.log(`[API PROXY REFRESH DEBUG] Token rotation successful! Retrying original request to: ${targetUrl}`);

                            forwardHeaders.set('Authorization', `Bearer ${newAccessToken}`);
                            response = await fetch(targetUrl, {
                                method: method.toUpperCase(),
                                headers: forwardHeaders,
                                body: fetchBody,
                            });
                            console.log(`[API PROXY REFRESH DEBUG] Retried request HTTP status: ${response.status}`);
                        } else {
                            console.error(`[API PROXY REFRESH DEBUG] ERROR: Could not find access_token / accessToken in refresh response payload! Parsed response:`, refreshData);
                        }
                    } else {
                        console.warn(`[API PROXY REFRESH DEBUG] Token refresh endpoint rejected with status ${refreshRes.status}. Response: ${refreshText}`);
                    }
                } catch (refreshErr) {
                    console.error('[API PROXY REFRESH DEBUG] Exception during token refresh fetch:', refreshErr);
                }
            } else {
                console.warn(`[API PROXY REFRESH DEBUG] Cannot attempt token rotation: No 'noe_refresh_token' cookie found in request.`);
            }
        }

        const resBodyText = await response.text();
        let parsedData: any;
        try {
            parsedData = JSON.parse(resBodyText);
        } catch (e) {
            parsedData = resBodyText;
        }

        const res = NextResponse.json(parsedData, { status: response.status });

        const dataObj = parsedData?.data || parsedData;
        const respAccessToken = dataObj?.access_token || dataObj?.accessToken || dataObj?.token;
        const respRefreshToken = dataObj?.refresh_token || dataObj?.refreshToken;

        // Save rotated access and refresh tokens to cookies
        if (didRefresh && newAccessToken && newRefreshToken) {
            console.log(`[API PROXY REFRESH DEBUG] Setting rotated cookies 'noe_token' and 'noe_refresh_token'`);
            res.cookies.set('noe_token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 30 * 24 * 60 * 60, // 30 days
            });
            res.cookies.set('noe_refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 30 * 24 * 60 * 60, // 30 days
            });
            const accType = getAccountTypeFromToken(newAccessToken);
            if (accType) {
                res.cookies.set('account_type', accType, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60,
                });
            }
        } else if (response.status >= 200 && response.status < 300) {
            if (respAccessToken) {
                console.log(`[API PROXY REFRESH DEBUG] Setting 'noe_token' cookie from response (endpoint: ${endpoint})`);
                res.cookies.set('noe_token', respAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                });
                const accType = getAccountTypeFromToken(respAccessToken);
                if (accType) {
                    res.cookies.set('account_type', accType, {
                        httpOnly: false,
                        secure: process.env.NODE_ENV === 'production',
                        path: '/',
                        maxAge: 30 * 24 * 60 * 60,
                    });
                }
            }
            if (respRefreshToken) {
                console.log(`[API PROXY REFRESH DEBUG] Setting 'noe_refresh_token' cookie from response (endpoint: ${endpoint})`);
                res.cookies.set('noe_refresh_token', respRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                });
            }
        }

        // If the server explicitly rejected auth (and refresh failed), or user logged out, wipe the cookies
        if ((response.status === 401 && !isAuthEndpoint) || endpoint.includes('/auth/logout')) {
            console.warn(`[API PROXY REFRESH DEBUG] Clearing session cookies because final status is 401 for endpoint: "${endpoint}"`);
            res.cookies.delete('noe_token');
            res.cookies.delete('noe_refresh_token');
            res.cookies.delete('account_type');
        }

        return res;
    } catch (error: any) {
        console.error('API Proxy POST handler error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Proxy failure' }, { status: 502 });
    }
}
