import { NextResponse } from 'next/server';
import { localizedApiResponse, getLocale } from '@/lib/i18n-server';

export async function GET() {
  try {
    const locale = await getLocale();
    
    const data = {
      subscriptions: [],
      total: 0
    };

    return NextResponse.json(
      await localizedApiResponse(true, data, 'subscriptions.fetchSuccess', 200)
    );
  } catch (error) {
    return NextResponse.json(
      await localizedApiResponse(false, null, 'subscriptions.fetchError', 500),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.appName) {
      return NextResponse.json(
        await localizedApiResponse(false, null, 'errors.required', 400),
        { status: 400 }
      );
    }

    return NextResponse.json(
      await localizedApiResponse(true, body, 'subscriptions.created', 201),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      await localizedApiResponse(false, null, 'subscriptions.createError', 500),
      { status: 500 }
    );
  }
}
