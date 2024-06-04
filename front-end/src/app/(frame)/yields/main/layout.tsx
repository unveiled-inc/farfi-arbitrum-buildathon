import { headers as nextHeaders } from 'next/headers';
import type { Metadata } from 'next';
import { encodeToBase64 } from '@/funcs/base64';
import * as FrameInterface from '@/models/frame';
import { generateScaledTimestampURL } from '@/funcs/scale-timestamp';

export const metadata: Metadata = {
  title: 'FarFi',
  description: 'Earn yields on arbitrum',
  openGraph: {
    title: 'FarFi',
    description: 'Earn yields on arbitrum',
    images: [
      {
        url: 'https://farfi.1tx.network/api/og?name=pendlemain',
        width: 600,
        height: 600,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const headers = nextHeaders();
  const baseUrl = headers.get('Base-Url');

  const currentTimestamp = Date.now();

  return (
    <>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta
          property="og:image"
          content={`${baseUrl}/api/og?name=pendlemain&version=${currentTimestamp}`}
        />
        <meta
          property="fc:frame:image"
          content={`${baseUrl}/api/og?name=pendlemain&version=${currentTimestamp}`}
        />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="Event 🎁" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta
          property="fc:frame:button:1:target"
          content={`${baseUrl}/api/frame?name=pendleevent`}
        />
        <meta property="fc:frame:button:2" content="Explore" />
        <meta property="fc:frame:button:2:action" content="post" />
        <meta
          property="fc:frame:button:2:target"
          content={`${baseUrl}/api/frame?name=pendleexplorer`}
        />
        <meta property="fc:frame:button:3" content="Share" />
        <meta property="fc:frame:button:3:action" content="link" />
        <meta
          property="fc:frame:button:3:target"
          content={`https://warpcast.com/~/compose?text=Earn juicy yields on Arbitrum using @farfi and win up to 10 ETH!&embeds[]=${baseUrl}/yields/main?version=${currentTimestamp}`}
        />
      </head>
      <body className="">{children}</body>
    </>
  );
}
