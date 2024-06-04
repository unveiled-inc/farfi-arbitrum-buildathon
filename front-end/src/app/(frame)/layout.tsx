import type { Metadata } from 'next';
import { headers as nextHeaders } from 'next/headers';
import { Roboto } from 'next/font/google';
import type { Viewport } from 'next';
import type { NextRequest } from 'next/server';
import { encodeToBase64 } from '@/funcs/base64';
import * as FrameInterface from '@/models/frame';
import { generateScaledTimestampURL } from '@/funcs/scale-timestamp';
import '../globals.css';
// use `prisma` in your application to read and write data in your DB

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: '1TX',
  description: '1tx is executing multiple transactions',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const headers = nextHeaders();
  const frameName = headers.get('1tx-Frame-Name');
  const baseUrl = headers.get('Base-Url');
  const imageData = headers.get('1tx-Frame-Image');

  let metaTags;

  switch (frameName) {
    case 'rendermsg':
      const data = encodeToBase64({
        msg: 'Write & Share anything!',
      });
      metaTags = (
        <>
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:image"
            content={`${baseUrl}/api/og?name=rendermsg&image=${imageData || data}`}
          />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:input:text" content="Enter a message" />
          <meta property="fc:frame:button:1" content="Render" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta
            property="fc:frame:button:1:target"
            content={`${baseUrl}/api/frame?name=rendermsg`}
          />
          <meta property="fc:frame:button:2" content="Share" />
          <meta property="fc:frame:button:2:action" content="link" />
          <meta
            property="fc:frame:button:2:target"
            content={`https://warpcast.com/~/compose?embeds[]=${baseUrl}/frame?name=rendermsg%26image=${imageData || data}`}
          />
        </>
      );
      break;
  }

  return (
    <html
      lang="en"
      className={`${roboto.className} ${roboto.style} font-roboto antialiased`}
    >
      <head>{metaTags}</head>
      <body className="">{children}</body>
    </html>
  );
}
