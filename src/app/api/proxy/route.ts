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

// Module-level active token refresh Promise to prevent concurrent request race conditions
let activeRefreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

async function performTokenRefresh(backendUrl: string, refreshToken: string) {
    if (activeRefreshPromise) {
        return activeRefreshPromise;
    }

    activeRefreshPromise = (async () => {
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
            let refreshData: any;
            try {
                refreshData = JSON.parse(refreshText);
            } catch (e) {
                refreshData = null;
            }

            if (refreshRes.status >= 200 && refreshRes.status < 300 && refreshData) {
                const dataObj = refreshData?.data || refreshData;
                const newAccessToken =
                    dataObj?.access_token ||
                    dataObj?.accessToken ||
                    dataObj?.token ||
                    refreshData?.access_token ||
                    refreshData?.accessToken ||
                    refreshData?.token ||
                    null;

                const newRefreshToken =
                    dataObj?.refresh_token ||
                    dataObj?.refreshToken ||
                    refreshData?.refresh_token ||
                    refreshData?.refreshToken ||
                    refreshToken;

                if (newAccessToken) {
                    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
                }
            }
            return null;
        } catch (err) {
            console.error('[API PROXY] Token refresh failure:', err);
            return null;
        } finally {
            setTimeout(() => {
                activeRefreshPromise = null;
            }, 100);
        }
    })();

    return activeRefreshPromise;
}

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
                const refreshed = await performTokenRefresh(backendUrl, refreshToken);
                if (refreshed && refreshed.accessToken) {
                    newAccessToken = refreshed.accessToken;
                    newRefreshToken = refreshed.refreshToken;
                    didRefresh = true;

                    forwardHeaders.set('Authorization', `Bearer ${newAccessToken}`);
                    response = await fetch(targetUrl, {
                        method: method.toUpperCase(),
                        headers: forwardHeaders,
                        body: fetchBody,
                    });
                }
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
