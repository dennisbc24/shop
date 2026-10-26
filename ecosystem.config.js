module.exports = {
  apps: [
    {
      name: "inventario-backend",
      cwd: "../inventory/backend",
      script: "server.js",
      env: { NODE_ENV: "production", PORT: 3000 },
    },
    {
      name: "inventario-frontend",
      cwd: "../inventory/frontend",
      script: "node_modules/vite/bin/vite.js",
      args: "preview --port 8080 --host",
      env: { NODE_ENV: "production" },
    },
    {
      name: "shop",
      cwd: "./",
      script: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "127.0.0.1",
        NEXT_PUBLIC_API_URL: "https://inventario.cocinamejor.store/api/v1/public",
      },
    },
  ],
};
