/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  redirects: async () => {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "host",
            value: "https://www.ele-t3.vercel.app",
          },
        ],
        destination: "https://ele-t3.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default config;
