import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import { geckoTerminalChains, zeroExApiEndpoint } from '../const/frame-chains';
import { TokenParams, UserInfo } from '@/models/frame';

let prisma: PrismaClient;

const needToFetch = (data: Date, dataType: string) => {
  const s = 1000;
  const m = 60 * s;
  const h = 60 * m;

  const interval: { [key: string]: number } = {
    userInfo: 1 * h,
    geckoTerminalData: 5 * m,
    trendingToken: 10 * m,
    userBalance: 30 * s,
    zeroExData: 10 * s,
    blockedToken: 24 * h * 3,
    tokenPriceHistory: 1 * h,
  };

  if (!interval[dataType]) {
    return new Error('invalid dataType');
  }

  return data < new Date(Date.now() - interval[dataType]);
};

export const dbClient = async () => {
  if (!prisma) {
    const neon = new Pool({
      connectionString: process.env.POSTGRES_PRISMA_URL,
    });
    const adapter = new PrismaNeon(neon);
    prisma = new PrismaClient({ adapter });
    await prisma.$connect();
  }

  return prisma;
};

export const getTokenInfo = async (chain_id: number, token_address: string) => {
  token_address = token_address.toLowerCase();
  const start = performance.now();
  const prisma = await dbClient();
  const tokenInfo = await prisma.tokenInfo.findUnique({
    where: {
      chain_id_token_address: {
        chain_id,
        token_address,
      },
    },
    include: {
      GeckoTerminalData: true,
    },
  });
  const end = performance.now();

  console.log(`    - GetTokenInfo ${end - start} msec`);
  return tokenInfo;
};

export const searchToken = async (q: string, chainId?: number) => {
  const start = performance.now();
  const prisma = await dbClient();
  const P_exactMatch = prisma.tokenInfo.findMany({
    where: {
      symbol: {
        equals: q,
        mode: 'insensitive',
      },
      whitelisted: true,
      blocked: false,
      chain_id: chainId || 8453,
    },
    include: {
      GeckoTerminalData: true,
    },
    orderBy: [{ GeckoTerminalData: { volume_usd_h24: 'desc' } }],
    take: 1,
  });
  const P_similarMatch = prisma.tokenInfo.findMany({
    where: {
      symbol: {
        search: q,
        mode: 'insensitive',
      },
      whitelisted: true,
      blocked: false,
      chain_id: chainId || 8453,
    },
    include: {
      GeckoTerminalData: true,
    },
    orderBy: [{ GeckoTerminalData: { volume_usd_h24: 'desc' } }],
    take: 5,
  });

  const [exactMatch, similarMatch] = await Promise.all([
    P_exactMatch,
    P_similarMatch,
  ]);

  const end = performance.now();

  console.log(`    - SearchToken ${end - start} msec`);

  return [...exactMatch, ...similarMatch];
};

export const getZeroExTokenPrice = async (
  chain_id: number,
  token_address: string,
): Promise<{ price: string | null; updatedAt: Date | null }> => {
  const fetchStart = performance.now();
  const prisma = await dbClient();
  const P_tokenInfo = prisma.tokenInfo.findUnique({
    where: {
      chain_id_token_address: {
        chain_id,
        token_address,
      },
    },
  });

  const P_zeroExTokenPrice = prisma.zeroExData.findUnique({
    where: {
      chain_id_token_address: {
        chain_id,
        token_address,
      },
    },
  });

  const [tokenInfo, zeroExTokenPrice] = await Promise.all([
    P_tokenInfo,
    P_zeroExTokenPrice,
  ]);

  if (tokenInfo?.blocked) {
    return { price: null, updatedAt: null };
  }

  if (
    zeroExTokenPrice === null ||
    (zeroExTokenPrice && needToFetch(zeroExTokenPrice.updated_at, 'zeroExData'))
  ) {
    const response = await fetch(
      `${zeroExApiEndpoint[`${chain_id}`]}swap/v1/price?sellToken=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&buyToken=${token_address}&sellAmount=1000000000000000000`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          accept: 'application/json',
          '0x-api-key': process.env.ZEROEX_API_KEY as string,
        },
      },
    );
    const res = await response.json();

    if (!res.price) {
      return { price: null, updatedAt: null };
    }

    const { updated_at } = await prisma.zeroExData.upsert({
      where: {
        chain_id_token_address: {
          chain_id,
          token_address,
        },
      },
      update: {
        price: res.price,
      },
      create: {
        token_address,
        chain_id,
        price: res.price,
      },
    });
    const fetchEnd = performance.now();

    console.log(`    - GetZeroExData ${fetchEnd - fetchStart} msec`);
    return { price: res.price, updatedAt: updated_at };
  } else {
    const fetchEnd = performance.now();
    console.log(`    - GetZeroExData ${fetchEnd - fetchStart} msec`);
    return {
      price: zeroExTokenPrice.price.toString(),
      updatedAt: zeroExTokenPrice.updated_at,
    };
  }
};

export const getTokenBalanceData = async (
  fid: number,
  chain_id: number,
): Promise<{
  userInfo: any;
  userWallets: any[];
  tokenBalancesByWallet: any[];
  totalTokenBalances: any[];
}> => {
  const start = performance.now();
  const prisma = await dbClient();
  const { userInfo, userWallets } = await getUserFarcasterInfo(fid);

  let result: any = {
    userInfo: null,
    userWallets,
    tokenBalancesByWallet: [],
    totalTokenBalances: [],
  };

  if (userInfo !== null) {
    result.userInfo = userInfo;
  }

  if (userWallets === null || (userWallets && userWallets.length === 0)) {
    return result;
  }

  const filters = userWallets.map((wallet_address: string) => {
    return {
      chain_id,
      wallet_address,
    };
  });

  const balances = await prisma.tokenBalanceData.findMany({
    select: {
      chain_id: true,
      wallet_address: true,
      tokens: true,
      updated_at: true,
    },
    where: {
      OR: filters,
    },
  });

  const walletBalanceMap: any = {};
  balances.map((balance: any) => {
    walletBalanceMap[balance.wallet_address] = balance;
  });
  await Promise.all(
    userWallets.map(async (wallet: string) => {
      const target = walletBalanceMap[wallet];
      if (
        !target ||
        (target && needToFetch(target.updated_at, 'userBalance'))
      ) {
        const responseFromRouteScan = await fetch(
          `https://api.routescan.io/v2/network/mainnet/evm/${chain_id}/address/${wallet}/erc20-holdings?limit=100`,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        );
        const res = await responseFromRouteScan.json();
        const items = res.items;

        await prisma.tokenBalanceData.upsert({
          where: {
            chain_id_wallet_address: {
              chain_id,
              wallet_address: wallet,
            },
          },
          update: {
            tokens: items,
          },
          create: {
            chain_id,
            wallet_address: wallet,
            tokens: items,
          },
        });
        result.tokenBalancesByWallet.push({
          wallet_address: wallet,
          items,
        });
      } else {
        result.tokenBalancesByWallet.push({
          wallet_address: wallet,
          items: target.tokens,
        });
      }
    }),
  );

  let summary: { [key: string]: any } = {};
  result.tokenBalancesByWallet.forEach(
    (temp: { wallet_address: string; items: any[] }) => {
      if (temp.items.length > 0) {
        temp.items.forEach((token: any) => {
          const tokenAddress = token.tokenAddress.toLowerCase();
          summary[tokenAddress] = {
            ...token,
            tokenQuantity: (
              BigInt(summary[tokenAddress]?.tokenQuantity || 0) +
              BigInt(token.tokenQuantity)
            ).toString(),
          };
        });
      }
    },
  );

  // summary 객체의 각 토큰을 tokenQuantity에 따라 내림차순으로 정렬합니다.
  const sortedSummary = Object.values(summary).sort((a: any, b: any) => {
    const quantityA = BigInt(a.tokenQuantity);
    const quantityB = BigInt(b.tokenQuantity);
    return Number(quantityB - quantityA);
  });

  result.totalTokenBalances = sortedSummary;
  const end = performance.now();

  console.log(`    - GetTokenBalanceData ${end - start} msec`);
  return result;
};

export const searchUserFarcasterInfo = async (
  q: string,
): Promise<{ userInfo: UserInfo | null; userWallets: string[] }> => {
  const start = performance.now();
  const prisma = await dbClient();
  let userInfo = await prisma.userInfo.findMany({
    where: {
      fname: {
        equals: q,
        mode: 'insensitive',
      },
    },
  });

  if (userInfo.length === 0) {
    const searchResult = await fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${q}&limit=1`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          accept: 'application/json',
          api_key: process.env.NEYNAR_API_KEY || '',
        },
      },
    );

    const search = await searchResult.json();
    const user = search.result.users[0];

    if (user) {
      let userWallets: string[] = [
        ...new Set(user.verified_addresses?.eth_addresses as string[]),
      ];

      await prisma.userInfo.create({
        data: {
          fid: user.fid,
          fname: user.username,
          display_name: user.display_name,
          pfp_url: user.pfp_url,
          follower_count: user.follower_count,
          following_count: user.following_count,
        },
      });

      if (userWallets.length > 0) {
        const userWalletParams = userWallets.map((wallet: string) => ({
          fid: user.fid,
          wallet_address: wallet,
        }));

        await prisma.userWallet.createMany({
          data: [...userWalletParams],
          skipDuplicates: true,
        });
      }

      const end = performance.now();
      console.log(`    - SearchUserInfo ${end - start} msec`);
      return {
        userInfo: {
          fid: user.fid,
          fname: user.username,
          pfp_url: user.pfp_url,
          display_name: user.display_name,
          follower_count: user.follower_count,
          following_count: user.following_count,
        },
        userWallets,
      };
    } else {
      const end = performance.now();
      console.log(`    - SearchUserInfo ${end - start} msec`);
      return { userInfo: null, userWallets: [] };
    }
  }
  const end = performance.now();
  console.log(`    - SearchUserInfo ${end - start} msec +`);
  return await getUserFarcasterInfo(userInfo[0].fid);
};

export const getUserFarcasterInfo = async (
  fid: number,
): Promise<{ userInfo: UserInfo | null; userWallets: string[] }> => {
  if (!fid) {
    return { userInfo: null, userWallets: [] };
  }
  const start = performance.now();
  const prisma = await dbClient();
  const userInfo = await prisma.userInfo.findUnique({
    where: {
      fid,
    },
    include: {
      UserWallet: true,
    },
  });

  if (
    userInfo === null ||
    (userInfo && needToFetch(userInfo.updated_at, 'userInfo'))
  ) {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          accept: 'application/json',
          api_key: process.env.NEYNAR_API_KEY || '',
        },
      },
    );
    const res = await response.json();
    if (!res.users) {
      const end = performance.now();
      console.log(`    - GetUserFarcasterInfo ${end - start} msec`);
      return { userInfo: null, userWallets: [] };
    }
    const newUserInfo = {
      fid,
      fname: res.users[0].username,
      display_name: res.users[0].display_name,
      pfp_url: res.users[0].pfp_url,
      follower_count: res.users[0].follower_count,
      following_count: res.users[0].following_count,
    };

    let userWallets = res.users[0].verified_addresses.eth_addresses;

    userWallets = [...new Set(userWallets)];

    const P_updateUserInfo = prisma.userInfo.upsert({
      where: {
        fid,
      },
      update: newUserInfo,
      create: newUserInfo,
    });

    const P_fidsWallets = prisma.userWallet.findMany({
      select: {
        wallet_address: true,
      },
      where: {
        fid,
        active: true,
      },
    });

    const [, fidsWallets] = await Promise.all([
      P_updateUserInfo,
      P_fidsWallets,
    ]);

    let fidsWalletList: string[] = [];

    if (fidsWallets.length > 0 || userWallets.length > 0) {
      fidsWalletList = fidsWallets.map(
        (wallet: { wallet_address: string }) => wallet.wallet_address,
      );

      await Promise.all([
        ...fidsWalletList.map(async (wallet: any) => {
          if (!userWallets.includes(wallet)) {
            await prisma.userWallet.upsert({
              where: {
                fid_wallet_address: {
                  fid,
                  wallet_address: wallet,
                },
              },
              update: {
                active: false,
              },
              create: {
                fid,
                wallet_address: wallet,
                active: false,
              },
            });
          }
        }),
        ...userWallets.map(async (wallet: string) => {
          if (!fidsWalletList.includes(wallet)) {
            await prisma.userWallet.upsert({
              where: {
                fid_wallet_address: {
                  fid,
                  wallet_address: wallet,
                },
              },
              update: {
                active: true,
              },
              create: {
                fid,
                wallet_address: wallet,
                active: true,
              },
            });
          }
        }),
      ]);
    }
    const end = performance.now();
    console.log(`    - GetUserFarcasterInfo ${end - start} msec`);
    return { userInfo: newUserInfo, userWallets };
  } else if (userInfo && !needToFetch(userInfo.updated_at, 'userInfo')) {
    const fidsWallets = await prisma.userWallet.findMany({
      select: {
        wallet_address: true,
      },
      where: {
        fid,
        active: true,
      },
    });
    const fidsWalletList = fidsWallets.map(
      (wallet: { wallet_address: string }) => wallet.wallet_address,
    );
    const { updated_at, created_at, ...rest } = userInfo;

    const end = performance.now();
    console.log(`    - GetUserFarcasterInfo ${end - start} msec`);
    return { userInfo: rest, userWallets: fidsWalletList };
  } else {
    console.error('get userInfo fail');

    const end = performance.now();
    console.log(`    - GetUserFarcasterInfo ${end - start} msec`);
    return { userInfo: null, userWallets: [] };
  }
};

// geckoTerminal에 없는 토큰은 지원하지 않는다.
export const getTokenDataFromGeckoTerminal = async ({
  tokens,
}: {
  tokens: TokenParams[];
}) => {
  const start = performance.now();
  const prisma = await dbClient();
  let returnData: any = [...tokens];

  const tokenDataList = await prisma.geckoTerminalData.findMany({
    where: {
      OR: [...tokens],
    },
    include: {
      TokenInfo: true,
    },
  });

  // Create a map to store token data for quick lookup
  const tokenDataMap: any = {};
  if (tokenDataList.length > 0) {
    tokenDataList.forEach((tokenData) => {
      const key = `${tokenData.chain_id}-${tokenData.token_address}`;
      tokenDataMap[key] = {
        chain_id: tokenData.chain_id,
        token_address: tokenData.token_address,
        updated_at: tokenData.updated_at,
        TokenInfo: tokenData.TokenInfo,
      };
    });
  }

  await Promise.all(
    returnData.map(async (token: TokenParams) => {
      const target = tokenDataMap[`${token.chain_id}-${token.token_address}`];

      if (target === undefined) {
        const response = await fetch(
          `https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/tokens/${token.token_address}?include=top_pools`,
        );
        const res = await response.json();

        if (!res.data) {
          if (res.errors) {
            if (res.errors[0]?.status === '404') {
              await prisma.tokenInfo.upsert({
                where: {
                  chain_id_token_address: {
                    chain_id: token.chain_id,
                    token_address: token.token_address,
                  },
                },
                update: {
                  blocked: true,
                },
                create: {
                  chain_id: token.chain_id,
                  token_address: token.token_address,
                  blocked: true,
                },
              });
              await prisma.geckoTerminalData.upsert({
                where: {
                  chain_id_token_address: {
                    chain_id: token.chain_id,
                    token_address: token.token_address,
                  },
                },
                update: {
                  market_cap_usd: 0,
                  price_usd: 0,
                  volume_usd_h24: 0,
                  price_change_h24: 0,
                },
                create: {
                  chain_id: token.chain_id,
                  token_address: token.token_address,
                  market_cap_usd: 0,
                  price_usd: 0,
                  volume_usd_h24: 0,
                  price_change_h24: 0,
                },
              });
              console.log(
                `Blocked ${geckoTerminalChains[token.chain_id]} - ${token.token_address}`,
              );
            }
          } else {
            console.log(
              `requestUrl: https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/tokens/${token.token_address}?include=top_pools`,
            );
            console.error(res);
          }
          return;
        }

        const geckoTerminalData = res.data?.attributes;
        const priceChange =
          res.included[0]?.attributes?.price_change_percentage?.h24;

        await prisma.tokenInfo.upsert({
          where: {
            chain_id_token_address: {
              chain_id: token.chain_id,
              token_address: token.token_address,
            },
          },
          update: {
            name: geckoTerminalData?.name || undefined,
            symbol: geckoTerminalData?.symbol || undefined,
            coingecko_coin_id:
              geckoTerminalData?.coingecko_coin_id || undefined,
            logo: geckoTerminalData?.image_url || undefined,
            decimals: geckoTerminalData?.decimals || undefined,
          },
          create: {
            chain_id: token.chain_id,
            token_address: token.token_address,
            name: geckoTerminalData?.name || undefined,
            symbol: geckoTerminalData?.symbol || undefined,
            coingecko_coin_id:
              geckoTerminalData?.coingecko_coin_id || undefined,
            logo: geckoTerminalData?.image_url || undefined,
            decimals: geckoTerminalData?.decimals || undefined,
          },
        });

        await prisma.geckoTerminalData.upsert({
          where: {
            chain_id_token_address: {
              chain_id: token.chain_id,
              token_address: token.token_address,
            },
          },
          update: {
            price_usd: geckoTerminalData.price_usd
              ? Number(geckoTerminalData.price_usd)
              : undefined,
            market_cap_usd: geckoTerminalData.market_cap_usd
              ? Number(geckoTerminalData.market_cap_usd)
              : undefined,
            volume_usd_h24: geckoTerminalData.volume_usd.h24
              ? Number(geckoTerminalData.volume_usd.h24)
              : undefined,
            price_change_h24: priceChange ? Number(priceChange) : undefined,
          },
          create: {
            chain_id: token.chain_id,
            token_address: token.token_address,
            price_usd: geckoTerminalData.price_usd
              ? Number(geckoTerminalData.price_usd)
              : undefined,
            market_cap_usd: geckoTerminalData.market_cap_usd
              ? Number(geckoTerminalData.market_cap_usd)
              : undefined,
            volume_usd_h24: geckoTerminalData.volume_usd.h24
              ? Number(geckoTerminalData.volume_usd.h24)
              : undefined,
            price_change_h24: priceChange ? Number(priceChange) : undefined,
          },
        });

        const responseChartData = await fetch(
          `https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/pools/${res.included[0]?.attributes?.address}/ohlcv/hour?aggregate=1&limit=24`,
        );
        const resChartData = await responseChartData.json();
        const chartData = resChartData?.data?.attributes?.ohlcv_list;

        if (chartData) {
          await prisma.tokenPriceHistory.create({
            data: {
              chain_id: token.chain_id,
              token_address: token.token_address,
              ohlcv_24h: chartData,
            },
          });
        }
      } else if (
        (target &&
          !target.TokenInfo?.blocked &&
          needToFetch(target.updated_at, 'geckoTerminalData')) ||
        (target &&
          target.TokenInfo?.blocked &&
          needToFetch(target.updated_at, 'blockedToken'))
      ) {
        try {
          const response = await fetch(
            `https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/tokens/${token.token_address}?include=top_pools`,
          );
          const res = await response.json();

          if (!res.data) {
            if (res.errors) {
              if (res.errors[0]?.status === '404') {
                await prisma.tokenInfo.upsert({
                  where: {
                    chain_id_token_address: {
                      chain_id: token.chain_id,
                      token_address: token.token_address,
                    },
                  },
                  update: {
                    blocked: true,
                  },
                  create: {
                    chain_id: token.chain_id,
                    token_address: token.token_address,
                    blocked: true,
                  },
                });
                await prisma.geckoTerminalData.upsert({
                  where: {
                    chain_id_token_address: {
                      chain_id: token.chain_id,
                      token_address: token.token_address,
                    },
                  },
                  update: {
                    market_cap_usd: 0,
                    price_usd: 0,
                    volume_usd_h24: 0,
                    price_change_h24: 0,
                  },
                  create: {
                    chain_id: token.chain_id,
                    token_address: token.token_address,
                    market_cap_usd: 0,
                    price_usd: 0,
                    volume_usd_h24: 0,
                    price_change_h24: 0,
                  },
                });
                console.log(
                  `Blocked ${geckoTerminalChains[token.chain_id]} - ${token.token_address}`,
                );
              }
            } else {
              console.log(
                `requestUrl: https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/tokens/${token.token_address}?include=top_pools`,
              );
              console.error(res);
            }
            return;
          }

          const geckoTerminalData = res.data.attributes;
          const priceChange =
            res.included[0]?.attributes?.price_change_percentage?.h24;

          // 업데이트 할 토큰 정보가 있다면 업데이트
          if (
            (!target.TokenInfo?.coingecko_coin_id &&
              geckoTerminalData?.coingecko_coin_id) ||
            (!target.TokenInfo?.symbol && geckoTerminalData?.symbol) ||
            (!target.TokenInfo?.name && geckoTerminalData?.name) ||
            (!target.TokenInfo?.logo && geckoTerminalData?.image_url) ||
            (!target.TokenInfo?.decimals && geckoTerminalData?.decimals)
          ) {
            await Promise.all([
              prisma.tokenInfo.update({
                where: {
                  chain_id_token_address: {
                    chain_id: token.chain_id,
                    token_address: token.token_address,
                  },
                },
                data: {
                  name: geckoTerminalData?.name || undefined,
                  symbol: geckoTerminalData?.symbol || undefined,
                  coingecko_coin_id:
                    geckoTerminalData?.coingecko_coin_id || undefined,
                  logo: geckoTerminalData?.image_url || undefined,
                  decimals: geckoTerminalData?.decimals || undefined,
                },
              }),
              prisma.geckoTerminalData.update({
                where: {
                  chain_id_token_address: {
                    chain_id: token.chain_id,
                    token_address: token.token_address,
                  },
                },
                data: {
                  price_usd: geckoTerminalData.price_usd
                    ? Number(geckoTerminalData.price_usd)
                    : undefined,
                  market_cap_usd: geckoTerminalData.market_cap_usd
                    ? Number(geckoTerminalData.market_cap_usd)
                    : undefined,
                  volume_usd_h24: geckoTerminalData.volume_usd.h24
                    ? Number(geckoTerminalData.volume_usd.h24)
                    : undefined,
                  price_change_h24: priceChange
                    ? Number(priceChange)
                    : undefined,
                },
              }),
              (async (): Promise<any> => {
                const existingChartData =
                  await prisma.tokenPriceHistory.findUnique({
                    where: {
                      chain_id_token_address: {
                        chain_id: token.chain_id,
                        token_address: token.token_address,
                      },
                    },
                  });
                if (
                  existingChartData === null ||
                  (existingChartData &&
                    needToFetch(
                      existingChartData.updated_at,
                      'tokenPriceHistory',
                    ))
                ) {
                  const responseChartData = await fetch(
                    `https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/pools/${res.included[0]?.attributes?.address}/ohlcv/hour?aggregate=1&limit=24`,
                  );
                  const resChartData = await responseChartData.json();

                  const chartData = resChartData?.data?.attributes?.ohlcv_list;

                  if (chartData) {
                    await prisma.tokenPriceHistory.upsert({
                      where: {
                        chain_id_token_address: {
                          chain_id: token.chain_id,
                          token_address: token.token_address,
                        },
                      },
                      create: {
                        chain_id: token.chain_id,
                        token_address: token.token_address,
                        ohlcv_24h: chartData,
                      },
                      update: {
                        ohlcv_24h: chartData,
                      },
                    });
                  }
                }
              })(),
            ]);
          } else {
            await Promise.all([
              prisma.geckoTerminalData.update({
                where: {
                  chain_id_token_address: {
                    chain_id: token.chain_id,
                    token_address: token.token_address,
                  },
                },
                data: {
                  price_usd: geckoTerminalData.price_usd
                    ? Number(geckoTerminalData.price_usd)
                    : undefined,
                  market_cap_usd: geckoTerminalData.market_cap_usd
                    ? Number(geckoTerminalData.market_cap_usd)
                    : undefined,
                  volume_usd_h24: geckoTerminalData.volume_usd.h24
                    ? Number(geckoTerminalData.volume_usd.h24)
                    : undefined,
                  price_change_h24: priceChange
                    ? Number(priceChange)
                    : undefined,
                },
              }),
              (async (): Promise<any> => {
                const existingChartData =
                  await prisma.tokenPriceHistory.findUnique({
                    where: {
                      chain_id_token_address: {
                        chain_id: token.chain_id,
                        token_address: token.token_address,
                      },
                    },
                  });
                if (
                  existingChartData === null ||
                  (existingChartData &&
                    needToFetch(
                      existingChartData.updated_at,
                      'tokenPriceHistory',
                    ))
                ) {
                  const responseChartData = await fetch(
                    `https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/pools/${res.included[0]?.attributes?.address}/ohlcv/hour?aggregate=1&limit=24`,
                  );
                  const resChartData = await responseChartData.json();

                  const chartData = resChartData?.data?.attributes?.ohlcv_list;

                  if (chartData) {
                    await prisma.tokenPriceHistory.upsert({
                      where: {
                        chain_id_token_address: {
                          chain_id: token.chain_id,
                          token_address: token.token_address,
                        },
                      },
                      create: {
                        chain_id: token.chain_id,
                        token_address: token.token_address,
                        ohlcv_24h: chartData,
                      },
                      update: {
                        ohlcv_24h: chartData,
                      },
                    });
                  }
                }
              })(),
            ]);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        const existingChartData = await prisma.tokenPriceHistory.findUnique({
          where: {
            chain_id_token_address: {
              chain_id: token.chain_id,
              token_address: token.token_address,
            },
          },
        });
        if (
          existingChartData === null ||
          (existingChartData &&
            needToFetch(existingChartData.updated_at, 'tokenPriceHistory'))
        ) {
          const response = await fetch(
            `https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/tokens/${token.token_address}?include=top_pools`,
          );
          const res = await response.json();
          const responseChartData = await fetch(
            `https://api.geckoterminal.com/api/v2/networks/${geckoTerminalChains[token.chain_id]}/pools/${res.included[0]?.attributes?.address}/ohlcv/hour?aggregate=1&limit=24`,
          );
          const resChartData = await responseChartData.json();

          const chartData = resChartData?.data?.attributes?.ohlcv_list;

          if (chartData) {
            await prisma.tokenPriceHistory.upsert({
              where: {
                chain_id_token_address: {
                  chain_id: token.chain_id,
                  token_address: token.token_address,
                },
              },
              create: {
                chain_id: token.chain_id,
                token_address: token.token_address,
                ohlcv_24h: chartData,
              },
              update: {
                ohlcv_24h: chartData,
              },
            });
          }
        }
      }
    }),
  );

  const resultData = await prisma.geckoTerminalData.findMany({
    where: {
      OR: [...tokens],
    },
    include: {
      TokenInfo: true,
      TokenPriceHistory: true,
    },
  });
  const resultDataMap: any = {};
  if (resultData.length > 0) {
    resultData.forEach((tokenData) => {
      const key = `${tokenData.chain_id}-${tokenData.token_address}`;
      resultDataMap[key] = {
        chain_id: tokenData.chain_id,
        token_address: tokenData.token_address,
        price_usd: tokenData.price_usd?.toNumber(),
        market_cap_usd: tokenData.market_cap_usd?.toNumber(),
        volume_usd_h24: tokenData.volume_usd_h24?.toNumber(),
        price_change_h24: tokenData.price_change_h24?.toNumber(),
        created_at: tokenData.created_at,
        updated_at: tokenData.updated_at,
        TokenInfo: tokenData.TokenInfo,
        TokenPriceHistory: tokenData.TokenPriceHistory,
      };
    });
  }

  // Create a map to store token data for quick lookup
  const result: any = [];
  returnData.map((ele: any) => {
    if (resultDataMap[`${ele.chain_id}-${ele.token_address}`]) {
      result.push(resultDataMap[`${ele.chain_id}-${ele.token_address}`]);
    }
  });

  const end = performance.now();
  console.log(`    - GetTokenDataFromGecko ${end - start} msec`);

  return result;
};

export const getTrendingTokensData = async () => {
  const start = performance.now();
  const prisma = await dbClient();
  const data = await prisma.coingeckoTrendingToken.findMany({
    orderBy: {
      created_at: 'desc',
    },
    take: 1,
  });
  let trendingTokens: any = data[0].trending_tokens;
  let createdAt: any = data[0].created_at;

  if (
    trendingTokens === null ||
    needToFetch(data[0].created_at, 'trendingToken')
  ) {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=farcaster-ecosystem`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY as string,
        },
      },
    );
    trendingTokens = await response.json();
    const result = await prisma.coingeckoTrendingToken.create({
      data: {
        trending_tokens: trendingTokens,
      },
    });

    createdAt = result.created_at;
  }

  const end = performance.now();
  console.log(`    - GetTrendingTokens ${end - start} msec`);
  return { trendingTokens, createdAt };
};
