module.exports = {
  apps: [{
    name: 'julyak-dev',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/kitri/webapp',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
