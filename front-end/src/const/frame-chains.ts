export const coingeckoChains: { [key: string]: string } = {
  '1': 'ethereum',
  '43114': 'avalanche',
  '42161': 'arbitrum-one',
  '10': 'optimistic-ethereum',
  '8453': 'base',
  '56': 'binance-smart-chain',
  '42220': 'celo',
  '250': 'fantom',
  '137': 'polygon-pos',
};

export const geckoTerminalChains: { [key: string]: string } = {
  '1': 'eth',
  '43114': 'avax',
  '42161': 'arbitrum',
  '10': 'optimism',
  '8453': 'base',
  '56': 'bsc',
  '42220': 'celo',
  '250': 'ftm',
  '137': 'polygon_pos',
};

export const reversedCoingeckoChains: { [key: string]: number } = {
  ethereum: 1,
  avalanche: 43114,
  'arbitrum-one': 42161,
  'optimistic-ethereum': 10,
  base: 8453,
  'binance-smart-chain': 56,
  celo: 42220,
  fantom: 250,
  'polygon-pos': 137,
};

export const zeroExApiEndpoint: { [key: string]: string } = {
  '1': 'https://api.0x.org/',
  '43114': 'https://avalanche.api.0x.org/',
  '42161': 'https://arbitrum.api.0x.org/',
  '10': 'https://optimism.api.0x.org/',
  '8453': 'https://base.api.0x.org/',
  '56': 'https://bsc.api.0x.org/',
  '42220': 'https://celo.api.0x.org/',
  '250': 'https://fantom.api.0x.org/',
  '137': 'https://polygon.api.0x.org/',
};

export const warpcastTxChains: { [key: string]: string } = {
  '1': 'eip155:1',
  '10': 'eip155:10',
  '42161': 'eip155:42161',
  '8453': 'eip155:8453',
  '7777777': 'eip155:7777777',
  '666666666': 'eip155:666666666',
};
