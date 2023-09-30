// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cms.bdkinc.com",
        pathname: "/**",
      },
    ],
  },
};
