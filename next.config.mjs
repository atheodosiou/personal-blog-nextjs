/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  async redirects() {
    return [{ source: "/assets/sitemap.xml", destination: "/sitemap.xml", permanent: true }];
  },
  // othor next config here...
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
  env: {
    API_BASE_URL:
      process.env.NODE_ENV === "development"
        ? "anastasios.theodosiou.me"
        : "http://127.0.0.1:3001",
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.buymeacoffee.com" }],
    qualities: [75, 90],
  },
};

export default nextConfig;

class VeliteWebpackPlugin {
  static started = false;
  constructor(/** @type {import('velite').Options} */ options = {}) {
    this.options = options;
  }
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs !!!
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      this.options.watch = this.options.watch ?? dev;
      this.options.clean = this.options.clean ?? !dev;
      const { build } = await import("velite");
      await build(this.options); // Compiler tooling is loaded only during a build.
    });
  }
}
