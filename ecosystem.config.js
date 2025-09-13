module.exports = {
  apps: [
    {
      name: 'nextjs-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/root/hhc-dropship',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      }
    },
    {
      name: 'backend-server',
      script: 'node',
      args: 'server/app.js',
      cwd: '/root/hhc-dropship',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      }
    }
  ]
};