import { extractChain, createPublicClient, http, type Chain } from 'viem';
import * as chains from 'viem/chains';

export const getChain = (id: number): Chain | null => {
  const chain = extractChain({
    chains: Object.values(chains),
    id: id as any,
  });

  if (!chain) {
    return null;
  }

  return chain;
};

export const publicClient = (id: number) => {
  const chain = getChain(id);
  if (chain === null) {
    return null;
  }
  return createPublicClient({
    chain,
    transport: http(id === 8453 ? process.env.BASE_MAINNET_RPC_URL : ''),
    batch: {
      multicall: true,
    },
    cacheTime: 5_000,
    pollingInterval: 1_000,
  });
};
