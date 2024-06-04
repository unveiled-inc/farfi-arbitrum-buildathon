import * as FrameInterface from '@/models/frame';
import { ReactElement } from 'react';
import { decodeBase64, encodeToBase64 } from '@/funcs/base64';
import { decodeData } from '@/funcs/neynar-decode';

const PendleMain = async ({
  baseUrl,
}: {
  reqRawData: string;
  baseUrl: string;
}): Promise<ReactElement> => {
  const currentTimestamp = Date.now();

  return (
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
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
      <body></body>
    </html>
  );
};

export default PendleMain;
