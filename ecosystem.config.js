module.exports = {
  apps : [{
    name: "app",
    script: "./dist/server/index.js",
    instances: 1,
    exec_mode : "cluster",
    autorestart : true,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
