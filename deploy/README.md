# Static Caddy deployment

The website and `/demo` run entirely in the browser. The static entry uses the same React components as the TanStack Start routes; it needs no Node server or database in production.

```sh
npm ci
npm run build:static
```

Upload the contents of `deploy/dist/` to a new release directory, such as `C:/caddy/veilan/releases/<release>/`. Keep the preceding release and Caddy configuration for rollback. Point only the Veilan site's existing `root` at the new directory; leave unrelated site imports, TLS, and the shared `site_common` snippet unchanged.

The site block needs this SPA fallback so directly opening or refreshing `/demo` works:

```caddyfile
root * "C:/caddy/veilan/releases/<release>"
encode zstd gzip
@assets path /assets/*
header @assets Cache-Control "public, max-age=31536000, immutable"
@pages path / /index.html /demo /demo/
header @pages Cache-Control "no-cache"
try_files {path} /index.html
file_server
```

Validate the full existing Caddy configuration using the same Caddy binary that runs the service, then reload it. On a failed health check, restore the preceding site configuration and reload it. Never upload credentials or include them in deployment scripts.

This is an interactive visual prototype, not an operating system or installer. Notes, window positions, wallpaper, and preferences stay in browser storage. The terminal only understands the demo commands listed by `help`; it never executes host commands. The network and battery icons are decorative simulated status.
