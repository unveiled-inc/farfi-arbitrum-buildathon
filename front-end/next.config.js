/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack: (config) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      config.resolve.fallback = { fs: false, net: false, tls: false };
      return config;
    },
    // eslint: {
    //     // Warning: This allows production builds to successfully complete even if
    //     // your project has ESLint errors.
    //     ignoreDuringBuilds: true,
    // },
    // by default, react renders component twice in development to detect bugs/issues
    // this can be disabled by uncommenting below but is not recommended
    // in production, this will have to be disabled
    // https://stackoverflow.com/questions/71847778/why-my-nextjs-component-is-rendering-twice
    // https://nextjs.org/docs/pages/api-reference/next-config-js/reactStrictMode
    // reactStrictMode: false,
    async redirects() {
      return [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'avax-particle.1tx.network',
            },
          ],
          destination: '/discover',
          permanent: true,
        },
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'farfi.1tx.network',
            },
          ],
          destination: '/frame',
          permanent: true,
        },
      ];
    },
    images: {
      dangerouslyAllowSVG: true,
    },
  };
  
  module.exports = nextConfig;
  