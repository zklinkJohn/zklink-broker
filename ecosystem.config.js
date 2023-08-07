const dotenv = require('dotenv')

dotenv.config({ path: `.env.devnet` })
dotenv.config({ path: `.env.devnet.local`, override: true })

module.exports = {
  apps: [
    {
      name: 'zklink-node-witness',
      script: 'yarn start:witness',
      kill_timeout: 10000,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_devnet: {
        APP_ENV: 'devnet',
      },
      env_testnet: {
        APP_ENV: 'testnet',
      },
    },
    {
      name: 'zklink-node-broker',
      script: 'yarn start:broker',
      kill_timeout: 10000,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_devnet: {
        APP_ENV: 'devnet',
      },
      env_testnet: {
        APP_ENV: 'testnet',
      },
    },
  ],
  deploy: {
    'watcher:devnet': {
      user: process.env.DEPLOY_USER,
      host: [process.env.DEPLOY_HOST],
      ref: 'origin/master',
      repo: process.env.DEPLOY_REPO,
      path: process.env.DEPLOY_PATH,
      'pre-deploy': 'git fetch --all',
      'post-deploy': 'yarn && pm2 restart ecosystem.config.js --env devnet',
    },
  },
}
