import { NextRequest, NextResponse } from 'next/server';
import frames from './index';
import React, { ReactElement } from 'react';
import { decodeBase64, encodeToBase64 } from '@/funcs/base64';

// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

const convertToString = async (component: ReactElement) => {
  const ReactDOMServer = (await import('react-dom/server')).default;
  const converted = ReactDOMServer.renderToString(component);
  return converted;
};

export async function POST(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const reqdata = await req.json();
  const name = params.get('name');
  const reqRawData = encodeToBase64(reqdata);
  const baseUrl = req.headers.get('Base-Url');
  if (name === null) {
    return new NextResponse('Invalid frame name', {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const frameName = Object.keys(frames).filter(
    (filter: string) => filter.toLowerCase() === name.toLowerCase(),
  )[0];

  try {
    const FrameComponent = frames[frameName];

    const htmlResponse = await convertToString(
      await FrameComponent({ reqRawData, baseUrl }),
    );

    return new NextResponse(htmlResponse, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message },
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    } else {
      return NextResponse.json(
        { message: 'An unexpected error occurred' },
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }
}
