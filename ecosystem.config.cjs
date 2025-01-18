// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './index.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      output: './logs/backend-out.log',
      error: './logs/backend-error.log',
      log: './logs/backend-combined.log',
    },
    {
      name: 'frontend',
      script: 'npx',
      args: 'http-server ./public -p 5000',
      watch: true,
      output: './logs/frontend-out.log',
      error: './logs/frontend-error.log',
      log: './logs/frontend-combined.log',
    },
  ],
};
