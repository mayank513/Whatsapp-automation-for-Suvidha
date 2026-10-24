# MarketLoop — client workspace (v0.4)

Daily product PDF generation, one-time/daily campaign scheduling, pause controls, opt-out handling and per-recipient sending logs are implemented. Read `STEP4.md` for file layout, installation, activation and limits. The campaign worker stays off by default.

Complete local source for a supermarket dashboard with real account authentication, a creator/admin access screen and two WhatsApp connection paths.

## Run on Windows

Requires Node.js 24+, an internet connection and persistent local disk. Start in this folder:

```powershell
if (!(Test-Path '.env')) { Copy-Item .env.example .env }
# Edit .env: set ADMIN_EMAIL, a unique ADMIN_PASSWORD (12+ characters),
# and TOKEN_ENCRYPTION_KEY. Keep .env private.
npm install
npm start
```

If PowerShell blocks npm.ps1, use `npm.cmd install` and `npm.cmd start`.
Open http://127.0.0.1:3080/client. Create a client account for a supermarket; sign in with the configured administrator email for client access management. Do not use sample/shared passwords. This does not implement password recovery or email verification yet.

## Linked-device QR

Sign in as a store owner → WhatsApp connection → Linked-device QR → Generate QR. Open the store phone's WhatsApp → Linked devices → Link a device. Scan the actual generated QR and wait for Connected. The server must remain running. Sessions are stored per store in the private data directory. `CHROME_EXECUTABLE_PATH` can select an existing Chrome installation if the Puppeteer download is unavailable. This is an unofficial WhatsApp Web integration with reliability and account-restriction risk. It is not Meta Cloud API access.

The QR is never fabricated. Without installed dependencies/a running browser the dashboard shows the underlying configuration requirement. Signing into the dashboard is separate from linking a WhatsApp account. Existing saved device sessions reconnect when Generate QR is clicked after server restart.

## Official business onboarding

Set META_APP_ID, META_APP_SECRET, META_CONFIG_ID, META_GRAPH_VERSION and a 64-hex-character TOKEN_ENCRYPTION_KEY in the server environment. Use your app's supported Graph version and reviewed Embedded Signup configuration, configure the allowed HTTPS origin/domain in Meta, and enable the supported business onboarding flow. Client SDK requests a code; backend exchanges it, validates the selected phone against the authorized business, subscribes the app, and encrypts the token at rest. The complete external flow requires your real app configuration, app permissions, number readiness, billing and approvals. No official connection is claimed before the server validates it. Coexistence QR availability depends on Meta's supported onboarding, not the mock interface.

Webhook URL: `/api/webhooks/meta`. Configure META_WEBHOOK_VERIFY_TOKEN, subscribe the messages field in the Meta app, and expose the backend over HTTPS. Incoming webhook signatures are validated with META_APP_SECRET. Official free-text sending is restricted to recorded incoming messages within the last 24 hours. Campaigns use approved document marketing templates. An authorized, connected store may send individual service replies to customers with recorded service permission.

## Client screens

- Overview: real store totals, recent orders and setup checklist.
- WhatsApp: actual QR lifecycle, status, reset, and official onboarding.
- Products: add/edit prices, units, stock thresholds, search and CSV export.
- Customers: address, international number, service/marketing consent, consent source and CSV export.
- Orders: item quantities, server-calculated prices, stock reservation, minimum order and free-delivery threshold, statuses, cancellation stock restoration and CSV export.
- Inbox: inbound messages, explicit single-customer replies, manual refresh.
- Daily PDFs/offers: current-product PDF generation or uploaded PDF, preview, explicit one-time/daily scheduling, pause controls and per-recipient sending logs.
- Payments: manual bank/cash payment references clearly separated from unimplemented gateway verification.
- Delivery: staff assignment, instructions and fulfilment status.
- Automations: daily catalogue configuration, plus readiness indicators for other unimplemented workflows. Explicitly scheduled catalogue jobs can send when the worker is enabled.
- Reports: order counts, recorded paid amount, seven-day counts and CSV.
- Settings: store details, delivery areas/charges, opening hours, cutoff, payment preferences and staff contact.
- Creator admin: lists clients; enables/disables access server-side, revokes dashboard sessions and stops linked-device workers. Official inbound events and all client APIs also check the access flag.

## Boundaries and next integration work

Message-template creation, automatic retry of uncertain sends, delivered/read-receipt reconciliation, payment-link creation, gateway-signature validation, automated payment reconciliation, staff logins/permissions, password reset and email verification still require implementation. Opening static HTML does not run the backend. Static hosting cannot run the Node/Chromium linked-device service: deploy it on a persistent Node server/VPS. Run one process per database. Before a multi-client public launch, configure HTTPS, secure cookies, private disk/backups, account recovery, monitoring and provider credentials. Only client and creator/admin roles have been specified. Live PDF rendering and WhatsApp sends are unverified here due to missing dependencies and provider setup.

Store records and session hashes are in `data/marketloop.sqlite`; WhatsApp sessions and PDF files are in the same private directory. Never expose or commit it. Authentication uses scrypt password hashes, HttpOnly SameSite cookies, origin checks and server-side tenant authorization. Shared store writes use revision checks to prevent silently overwriting another session's edits. Demo HTML does not store passwords or API credentials in browser storage.

## Validation

```powershell
npm run check
npm test
```

Tests use a separate temporary database. Live QR scanning and Meta authorization require your phone and Meta app and are not covered by offline tests.

## Step 3: commerce database (v0.3)

The Products, Customers, Orders, Order Items and Payment History tables are now separate tenant-scoped SQL tables. Prices and payment amounts have integer-paise columns. Orders retain the agreed product name/unit/price. Historical manual payment records are appended rather than overwritten.

Existing store records migrate automatically on startup in one transaction; a failed migration rolls back. Settings and messages stay in the store document; campaigns use dedicated plan, run and delivery tables. Commerce data is read from SQL tables after migration. Every store save commits stock, order lines, revisions and headers in one transaction. Duplicate record IDs and invalid prices/stock are rejected.

The client sidebar has a **Data Center** with record counts, starter CSV column templates, payment history and a complete per-store JSON export. CSV files are preparation templates; bulk CSV import and JSON restore are not implemented. The JSON export contains customer information and messages, so keep it private. It excludes credentials, sessions and WhatsApp tokens.

To update an existing installation, stop its server with Ctrl+C, make a private backup of its existing `data` directory, then copy the updated source files into that same installation. Preserve `.env`, `data`, and existing dependency folders. Restart with `npm.cmd start`; open `/client`. Do not replace your database with another installation's data. This build has been modified in the working source, not automatically installed into your Downloads folder.
