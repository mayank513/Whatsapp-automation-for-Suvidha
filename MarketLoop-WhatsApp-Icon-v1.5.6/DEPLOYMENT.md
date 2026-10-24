# Steps 9 and 10 — verification and production setup

Release 1.0.0 contains the complete source for Steps 1–10 plus deployment templates. Source preparation does not mean the app is deployed or live-provider certified.

## What is verified
Automated checks cover tenant isolation, stock, order confirmation, staff stages, marketing consent, queued notifications, admin access/session revocation, payment signature/capture validation, duplicate handling, transaction rollback, production configuration, and backup/restore integrity. See RELEASE-STATUS.md for the exact run results and remaining live checks.

## Local Windows installation
Extract the ZIP to a separate folder, stop the old server, then run Update-And-Start.cmd. It updates the specified Downloads project with a backup of application files. It preserves data, .env and existing dependencies. If needed run npm.cmd install. Open http://127.0.0.1:3080/client. Run npm.cmd run verify from the installed project. The updater does not install a Windows background service; the launcher window must remain open. A laptop that is off cannot host the app.

## Production Linux VPS deployment
Use a dedicated persistent Linux VPS with systemd, Node.js 24 installed as /usr/bin/node, Caddy and a supported Chrome installation. The systemd templates use /opt/marketloop for source, /var/lib/marketloop for data and /etc/marketloop for secrets. Only run one app process against this database. Do not deploy this backend as a static site or ephemeral serverless function.

1. Provision the VPS and point a domain's DNS to it. Install Node.js 24, Caddy, supported Chrome plus its system dependencies, and fonts for the store's actual languages. DejaVu is an example for supported text; Hindi needs an appropriate font such as Noto Sans Devanagari. Confirm /usr/bin/node and Chrome paths before continuing.
2. Create the service account and directories (run these on that VPS):

```sh
sudo useradd --system --create-home --home-dir /var/lib/marketloop --shell /usr/sbin/nologin marketloop
sudo install -d -o marketloop -g marketloop -m 700 /var/lib/marketloop /var/backups/marketloop
sudo install -d -o root -g marketloop -m 750 /etc/marketloop
sudo install -d -o marketloop -g marketloop -m 750 /opt/marketloop
```

3. Upload the extracted release contents to /opt/marketloop (not your development .env, test data or node_modules). Install dependencies as the service account so the browser download/cache belongs to it:

```sh
cd /opt/marketloop
sudo -u marketloop -H npm install --omit=dev
```

Retain the generated package-lock.json for repeat deployments and use npm ci thereafter. No lockfile was generated in development because the npm registry could not resolve; a clean dependency installation on the VPS remains required. Review npm audit before production and resolve findings without blindly applying breaking upgrades.

4. Copy deploy/production.env.example to /etc/marketloop/marketloop.env; edit real domain, administrator credentials, DATA_DIR and Chrome/font paths. Generate the encryption key with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Keep that key stable: rotating it without reauthorizing connections makes existing tokens unreadable. Set the file owner root:marketloop and mode 640. Keep merchant credentials in /etc/marketloop/payment-merchants.json, also mode 640. Never put secrets in dist.
5. Copy deploy/marketloop.service, deploy/marketloop-backup.service and deploy/marketloop-backup.timer to /etc/systemd/system/. The service reads the private environment. Adjust paths if your server layout differs. Validate units with systemd-analyze verify and the calendar with systemd-analyze calendar. Production startup refuses HTTP origin, insecure cookies, invalid port/key or missing persistent DATA_DIR. The doctor also checks dependencies and writable storage before starting.
6. Edit deploy/Caddyfile to your real domain. Merge it into the server's existing Caddy configuration; do not overwrite unrelated hosted sites. Validate the final Caddy config. Allow inbound 80/443 and your secured SSH access; keep port 3080 private on loopback. With public DNS and reachable ports, Caddy handles HTTPS certificate provisioning. Confirm your host supports Chrome sandboxing; do not add --no-sandbox to work around an unsupported host.
7. Start services:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now marketloop
sudo systemctl enable --now marketloop-backup.timer
sudo systemctl reload caddy
sudo systemctl status marketloop --no-pager
sudo journalctl -u marketloop -n 100 --no-pager
curl --fail https://YOUR-DOMAIN/api/health
```

8. Sign in through HTTPS, connect the supermarket WhatsApp account and run all live acceptance checks below before enabling schedules or live payments. Linked-device sessions persist in DATA_DIR/whatsapp, but after server restart click Connect to initialize the saved session. It may require scanning again; automatic reconnect is not implemented.

## Backup and recovery
The timer creates a database snapshot and all PDFs referenced by that snapshot at approximately 02:00 Asia/Kolkata. The tool uses SQLite's online backup API so committed WAL writes are included, validates integrity and records SHA256 checksums. It excludes credentials and active browser profiles. Do not copy only a live marketloop.sqlite file; WAL state may be missing.

```sh
node backup.mjs create /var/lib/marketloop /var/backups/marketloop
node backup.mjs restore /var/backups/marketloop/EXACT-BACKUP /var/lib/marketloop-restored
```

Restore requires a new/empty destination and verifies checksums before copying. It invalidates restored dashboard sessions. Stop the app before switching DATA_DIR to the restored directory, update directory ownership and secret configuration, then restart and verify orders. Keep the original directory for rollback. Credentials and encryption keys must be backed up separately in encrypted storage. Stop the app before an optional full filesystem backup of the WhatsApp browser profile; alternatively relink it after restore.

Backups on the same VPS do not protect against VPS loss. Configure encrypted offsite copies, retention and disk-space monitoring for your provider. This release does not automatically delete old backups, provision offsite storage or monitor uptime externally. Test restoration periodically.

## Live acceptance checks still required
- New client registration, admin login, disable existing session, denied login, re-enable and fresh login over HTTPS.
- QR scan with the owner's real device; confirm saved connection after restart. Verify official Meta onboarding if using official mode.
- Generate a PDF with real products and correct fonts; send only to consenting test recipients. Confirm delivered/read state directly in the provider where available.
- Place a small checkout through WhatsApp, confirm stock reservation, packing, staff assignment, delivery/pickup stages and customer notifications.
- Configure public HTTPS webhook URLs. Complete Razorpay TEST checkout, verify TEST acknowledgement and unchanged real order payment, then a controlled live verification after appropriate merchant setup. Verify cancelled/late-payment and refund-review operations.
- Restart and VPS reboot recovery, backup timer run and restore into a fresh data directory.
- Once those pass, enable campaign scheduling and any required payment/notification switches deliberately. Do not enable them merely because /api/health returns OK.

## Deployment status
No VPS address, domain or authenticated server connection was provided, so the production templates have not been installed or executed on a host. Caddy/systemd cannot be runtime-tested on this Windows workspace. No DNS, hosting purchase or provider secrets were changed. Supply the target domain and connected server access to finish installation and live acceptance. Do not paste passwords or private keys into chat.
