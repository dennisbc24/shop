# Deploy shop + inventario en misma EC2

## 1. Build

```bash
# inventario frontend (ya existe)
cd ~/proyects/inventory/frontend && npm run build && cp -r dist ../backend/dist

# shop
cd ~/proyects/shop
npm ci
npm run build
```

## 2. PM2 (2 frontends + 1 backend)

Usa `ecosystem.config.js` en shop:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
pm2 ls
# shop debe estar en :3001, inventario backend en :3000
```

O manual:

```bash
pm2 start inventory/backend/server.js --name inventario-backend
pm2 start "npm start -- -p 3001" --name shop --cwd shop
```

## 3. Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/cocinamejor.store
sudo ln -s /etc/nginx/sites-available/cocinamejor.store /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d inventario.cocinamejor.store -d cocinamejor.store -d www.cocinamejor.store
```

## 4. CORS

Backend `server.js` ya incluye `https://cocinamejor.store` y `https://www.cocinamejor.store`.
Rutas públicas sin JWT: `/api/v1/public/*` (products, existence, stockLow, inStock).
Fuente de verdad sigue siendo Postgres (sin duplicar BD).

## 5. Variables

`shop/.env.local`:
```
NEXT_PUBLIC_API_URL=https://inventario.cocinamejor.store/api/v1/public
```
Para producción en EC2, usa misma variable en PM2 env.
