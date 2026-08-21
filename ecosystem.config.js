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
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      env: { NODE_ENV: "production", PORT: 3001, NEXT_PUBLIC_API_URL: "https://inventario.cocinamejor.store/api/v1/public" },
    },
  ],
};
