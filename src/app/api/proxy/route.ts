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
            if (refreshToken) {
                console.log(`[API PROXY] Token expired. Attempting token rotation...`);
                try {
                    const refreshRes = await fetch(`${backendUrl}/auth/token/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh_token: refreshToken }),
                    });

                    if (refreshRes.status === 200) {
                        const refreshData = await refreshRes.json();
                        if (refreshData?.success && refreshData?.data) {
                            newAccessToken = refreshData.data.access_token;
                            newRefreshToken = refreshData.data.refresh_token;
                            didRefresh = true;

                            console.log(`[API PROXY] Token rotation succeeded. Retrying request: ${targetUrl}`);
                            // Retry the original request with the new access token
                            forwardHeaders.set('Authorization', `Bearer ${newAccessToken}`);
                            response = await fetch(targetUrl, {
                                method: method.toUpperCase(),
                                headers: forwardHeaders,
                                body: fetchBody,
                            });
                        }
                    } else {
                        console.warn(`[API PROXY] Token rotation rejected: status ${refreshRes.status}`);
                    }
                } catch (refreshErr) {
                    console.error('[API PROXY] Token rotation error:', refreshErr);
                }
            }
        }

        const resBodyText = await response.text();
        let parsedData;
        try {
            parsedData = JSON.parse(resBodyText);
        } catch (e) {
            parsedData = resBodyText;
        }

        const res = NextResponse.json(parsedData, { status: response.status });

        // Save rotated access and refresh tokens to cookies
        if (didRefresh && newAccessToken && newRefreshToken) {
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
        } else if (response.status >= 200 && response.status < 300 && parsedData?.success && parsedData?.data) {
            const data = parsedData.data;
            if (data.access_token) {
                res.cookies.set('noe_token', data.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                });
                const accType = getAccountTypeFromToken(data.access_token);
                if (accType) {
                    res.cookies.set('account_type', accType, {
                        httpOnly: false,
                        secure: process.env.NODE_ENV === 'production',
                        path: '/',
                        maxAge: 30 * 24 * 60 * 60,
                    });
                }
            }
            if (data.refresh_token) {
                res.cookies.set('noe_refresh_token', data.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                });
            }
        }

        // If the server explicitly rejected auth (and refresh failed), or user logged out, wipe the cookies
        if ((response.status === 401 && !isAuthEndpoint) || endpoint.includes('/auth/logout')) {
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
