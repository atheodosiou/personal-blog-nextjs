module.exports = {
  apps: [
    {
      name: "Portfolio",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
