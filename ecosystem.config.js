module.exports = {
  apps: [
    {
      name: "portfolio",
      cwd: __dirname,
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NEXT_BUILD_DIR: ".next",
      },
      env_production: {
        PORT: 3001,
        NODE_ENV: "production",
      },
    },
  ],
};
