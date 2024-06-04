import { ReactElement } from 'react';
import { decodeBase64, encodeToBase64 } from '@/funcs/base64';
import { getTop3MarketData } from '@/funcs/db-pendle';
import { dbClient } from '@/funcs/db';

const PendleExplorer = async ({
  baseUrl,
  reqRawData,
}: {
  reqRawData: string;
  baseUrl: string;
}): Promise<ReactElement> => {
  try {
    const start = performance.now();
    const marketList = await getTop3MarketData(3);

    // const prisma = await dbClient();
    // const marketList = await prisma.pendleMarket.findMany({
    //   where: {
    //     chain_id: 42161,
    //     whitelisted: true,
    //   },
    //   orderBy: {
    //     implied_apy: 'desc',
    //   },
    //   take: 3,
    // });

    const markets = marketList.map((market) => market?.market_address);

    const currentTimestamp = Date.now();

    const imageData = encodeToBase64({ markets });

    const end = performance.now();

    console.log(`pendle-explorer: ${end - start} msec`);

    return (
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:image"
            content={`${baseUrl}/api/og?name=pendleexplorer&image=${imageData}&version=${currentTimestamp}`}
          />
          <meta
            property="fc:frame:input:text"
            content="Input No(e.g., 1) & click Detail"
          />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta
            property="fc:frame:state"
            content={JSON.stringify({
              markets,
            })}
          />
          <meta property="fc:frame:button:1" content="Detail" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta
            property="fc:frame:button:1:target"
            content={`${baseUrl}/api/frame?name=pendlept`}
          />
          <meta property="fc:frame:button:2" content="Share" />
          <meta property="fc:frame:button:2:action" content="link" />
          <meta
            property="fc:frame:button:2:target"
            content={`https://warpcast.com/~/compose?embeds[]=${baseUrl}/yields/main?version=${currentTimestamp}`}
          />
        </head>
        <body></body>
      </html>
    );
  } catch (err) {
    console.error(err);
    return (
      <html>
        <head></head>
        <body>Fail to create frame</body>
      </html>
    );
  }
};

export default PendleExplorer;
