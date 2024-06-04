import * as FrameInterface from '@/models/frame';
import { ReactElement } from 'react';
import { decodeBase64, encodeToBase64 } from '@/funcs/base64';
import { decodeData } from '@/funcs/neynar-decode';

const PendleEvent = async ({
  baseUrl,
  reqRawData,
}: {
  reqRawData: string;
  baseUrl: string;
}): Promise<ReactElement> => {
  const reqData: FrameInterface.FrameSignaturePacket = decodeBase64(reqRawData);
  const currentTimestamp = Date.now();

  const imageData = encodeToBase64({ fid: reqData.untrustedData.fid });

  return (
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content={`${baseUrl}/api/og?name=pendleevent&image=${imageData}&version=${currentTimestamp}`}
        />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="Home" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta
          property="fc:frame:button:1:target"
          content={`${baseUrl}/api/frame?name=pendlemain`}
        />
        <meta property="fc:frame:button:2" content="/farfi" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta
          property="fc:frame:button:2:target"
          content={`https://warpcast.com/~/channel/farfi`}
        />
        <meta property="fc:frame:button:3" content="Detail" />
        <meta property="fc:frame:button:3:action" content="link" />
        <meta
          property="fc:frame:button:3:target"
          content={`https://unveiled.notion.site/FarFi-Frame-It-Event-76049f68afbf4601917835795169a4ea`}
        />
        {/* <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta
          property="fc:frame:button:2:target"
          content={`https://warpcast.com/~/compose?embeds[]=${baseUrl}/yields/main?version=${currentTimestamp}`}
        /> */}
      </head>
      <body></body>
    </html>
  );
};

export default PendleEvent;
