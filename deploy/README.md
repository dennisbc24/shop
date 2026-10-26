# Deploy shop + inventario en misma EC2

La EC2 es un `t3.nano` (512 MB). **No compilar Next.js en la instancia**: se cuelga.
El build se hace en GitHub Actions (o en tu PC) y a la EC2 solo se sube el artefacto
ya compilado (`output: "standalone"`), como mucho ~50-100 MB.

## Flujo automático (recomendado)

Cada `git push` a `main` dispara `.github/workflows/deploy.yml`, que:

1. Compila en el runner de GitHub (Node 20, RAM de sobra).
2. Empaqueta `.next/standalone` + `.next/static` + `public` en `release.tar.gz`.
3. Sube el tarball a la EC2 por SCP.
4. En la EC2: `git fetch/reset` (solo config, sin build), extrae el release en
   `.next/standalone`, y reinicia PM2 (`pm2 delete shop` + `pm2 start ... --only shop`).

Secretos requeridos en el repo (Settings > Secrets and variables > Actions):
`EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` y opcional `EC2_SSH_PORT`.
Variables opcionales: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SHOP_URL`.

Hay un corte de pocos segundos por el `pm2 delete/start`.

## Flujo manual (FileZilla / sin CI)

### 1. Compilar en tu PC

```powershell
powershell -ExecutionPolicy Bypass -File deploy\build-release.ps1
```

Genera `deploy\release.tar.gz` (ya incluye `server.js`, `.next/static` y `public`).

### 2. Subir el tarball

Súbelo por FileZilla a `/tmp/release.tar.gz`.

### 3. Activarlo por SSH (una sola vez, sin build)

```bash
cd ~/proyects/shop        # o ~/shop
git fetch origin main
git reset --hard origin/main
bash deploy/activate-release.sh /tmp/release.tar.gz
```

Si algo falla, el release anterior queda en `.next/standalone.old` para volver atrás:

```bash
rm -rf .next/standalone && mv .next/standalone.old .next/standalone
pm2 delete shop; pm2 start ecosystem.config.js --only shop; pm2 save
```

## PM2

`ecosystem.config.js` arranca el build standalone:

```bash
pm2 start ecosystem.config.js --only shop
pm2 save
pm2 startup
pm2 ls
# shop :3001, inventario backend :3000
```

## Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/cocinamejor.store
sudo ln -s /etc/nginx/sites-available/cocinamejor.store /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d inventario.cocinamejor.store -d cocinamejor.store -d www.cocinamejor.store
```

## CORS

Backend `server.js` ya incluye `https://cocinamejor.store` y `https://www.cocinamejor.store`.
Rutas públicas sin JWT: `/api/v1/public/*` (products, existence, stockLow, inStock).
Fuente de verdad sigue siendo Postgres (sin duplicar BD).

## Variables

`NEXT_PUBLIC_*` se incrustan en el build, no en runtime. Para producción:

```
NEXT_PUBLIC_API_URL=https://inventario.cocinamejor.store/api/v1/public
```

En CI se pasa como `vars.NEXT_PUBLIC_API_URL` (con fallback al valor de arriba).
En local, `deploy\build-release.ps1` usa el mismo fallback si no está definida.
