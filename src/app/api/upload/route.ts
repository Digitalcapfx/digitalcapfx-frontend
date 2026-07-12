import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
        return NextResponse.json({ success: false, error: 'BACKEND_API_URL not configured' }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const purpose = formData.get('purpose') || 'misc';

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        // Reconstruct backend form data
        const forwardFormData = new FormData();
        forwardFormData.append('file', file);
        forwardFormData.append('purpose', purpose);

        // Prepare headers with Bearer token authorization
        const headers = new Headers();
        const cookieToken = request.cookies.get('noe_token')?.value;
        if (cookieToken) {
            headers.set('Authorization', `Bearer ${cookieToken}`);
        }

        console.log(`[FILE PROXY] POST ${backendUrl}/uploads (Purpose: ${purpose})`);

        const response = await fetch(`${backendUrl}/uploads`, {
            method: 'POST',
            headers,
            body: forwardFormData,
        });

        const resText = await response.text();
        let parsedData;
        try {
            parsedData = JSON.parse(resText);
        } catch (e) {
            parsedData = resText;
        }

        return NextResponse.json(parsedData, { status: response.status });
    } catch (error: any) {
        console.error('File Upload Proxy handler error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Proxy upload failure' }, { status: 502 });
    }
}
