import * as FrameInterface from '@/models/frame';
import { ReactElement } from 'react';
import { decodeBase64, encodeToBase64 } from '@/funcs/base64';
import { decodeData } from '@/funcs/neynar-decode';

const PendlePt = async ({
  baseUrl,
  reqRawData,
}: {
  reqRawData: string;
  baseUrl: string;
}): Promise<ReactElement> => {
  const reqData: FrameInterface.FrameSignaturePacket = decodeBase64(reqRawData);
  const state = reqData.untrustedData.state;
  const inputText = reqData.untrustedData.inputText;
  const chainId = 42161;
  const marketAddresses = state ? JSON.parse(state).markets : [];
  const marketIndex =
    isNaN(Number(inputText)) || inputText === '' ? null : Number(inputText) - 1;

  if (marketIndex === null || marketIndex >= marketAddresses.length) {
    throw new Error(
      `Please enter a number between 1 ~ ${marketAddresses.length}`,
    );
  }

  const marketAddress = marketAddresses[marketIndex];
  const currentTimestamp = Date.now();

  const imageData = encodeToBase64({
    chainId,
    marketAddress,
  });

  return (
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content={`${baseUrl}/api/og?name=pendlept&image=${imageData}&version=${currentTimestamp}`}
        />
        <meta
          property="fc:frame:state"
          content={JSON.stringify({
            address: marketAddress,
            chainId,
            method: 'pendle-deposit',
            buttons: ['home', 'buy', 'pendle'],
          })}
        />
        <meta
          property="fc:frame:input:text"
          content="Input ETH amount (e.g., 1)"
        />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="Home" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta
          property="fc:frame:button:1:target"
          content={`${baseUrl}/api/frame?name=pendlemain`}
        />
        <meta property="fc:frame:button:2" content="Buy PT" />
        <meta property="fc:frame:button:2:action" content="tx" />
        <meta
          property="fc:frame:button:2:target"
          content={`${baseUrl}/api/frametxdata`}
        />
        <meta
          property="fc:frame:button:2:post_url"
          content={`${baseUrl}/api/frame?name=swapresult`}
        />
        <meta property="fc:frame:button:3" content="Pendle" />
        <meta property="fc:frame:button:3:action" content="link" />
        <meta
          property="fc:frame:button:3:target"
          content={`https://app.pendle.finance/trade/markets`}
        />
      </head>
      <body></body>
    </html>
  );
};

export default PendlePt;
