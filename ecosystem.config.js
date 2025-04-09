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
        PORT: 3001,
        NODE_ENV: "production",
      },
    },
  ],
};
