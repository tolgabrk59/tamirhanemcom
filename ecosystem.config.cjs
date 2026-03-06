module.exports = {
  apps: [{
    name: 'tamirhanem-next',
    script: 'npm',
    args: 'run start -- -p 3002',
    cwd: '/home/dietpi/tamirhanem-next',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    }
  }]
};
