# Step 4 - daily product PDF and WhatsApp campaigns

## v0.4.1: fix for the unstyled file preview

The client HTML now loads CSS and JavaScript through adjacent relative paths, so opening it from disk no longer loses its layout. Direct file previews display startup instructions instead of attempting login without a backend. After installing this update, double-click `Start-MarketLoop.cmd` in the project root. The launcher installs missing dependencies, starts the server and opens the HTTP client dashboard once the health check succeeds. Keep its window open. The target is an application folder, not `dist/client.html`.

## File arrangement

`server.mjs` mounts the campaign APIs and runs the scheduling tick.

`campaigns.mjs` owns schedules, per-recipient logs, daily timezone calculation and interruption recovery.

`campaign-adapter.mjs` connects the scheduler to either WhatsApp Web linked-device sessions or the official WhatsApp Business Platform.

`catalogue.mjs` generates a paginated PDF from current in-stock products through PDFKit.

`dist/campaign-step4.js` adds the actual campaign creation, scheduling, pause, PDF preview and log controls. It replaces the previous draft-only campaign screen. It also updates automation readiness.

`campaigns.test.mjs` exercises consent, deduplication, scheduling, pausing and uncertain outcomes without sending messages.

`Install-Step4.cmd` launches `install-step4.mjs`, which installs the files into the exact Downloads project specified by the user. It requires `Step4-Application.zip` beside it and preserves the existing environment, private data and WhatsApp sessions. `Install-Step4.ps1` is an alternative installer. Neither is automatically executed by ChatGPT.

## Start

1. Stop the existing server with Ctrl+C.
2. Double-click Install-Step4.cmd and confirm the server is stopped.
3. In `C:\Users\DAMON\Downloads\Whatsapp CRM client\MarketLoop`, run `npm.cmd install` to install PDFKit as well as the existing QR dependencies.
4. Run `npm.cmd start` and open http://127.0.0.1:3080/client.
5. Sign in to the existing store account. Add real products and customer consent records.
6. Connect either WhatsApp method under WhatsApp connection.

## Prepare a PDF

Open Daily PDFs & offers, create a draft and enable automatic product PDF generation, or disable it and upload a PDF up to 8 MB. Only available products (stock greater than zero) are included in generated catalogues. A generated PDF is refreshed at each run; an uploaded PDF is reused. Preview the PDF before scheduling. PDF generation requires the dependency installation to succeed. Windows Nirmala / Segoe UI fonts are detected; set CATALOGUE_FONT_PATH for another Unicode TTF font if required. Complex-script layout should be reviewed in the generated preview.

## Enable real sending

Set `CAMPAIGN_WORKER_ENABLED=true` in the existing `.env` and restart. It is OFF by default. No draft sends by itself. Review a campaign and explicitly click Schedule sending to activate it. New schedules validate the selected connection; official campaigns also validate their approved marketing template and document header.

One-time schedules use the device timezone when choosing the date. Daily schedules use the selected IANA timezone, default Asia/Kolkata. A persistent Node server must stay running. After downtime, at most one overdue occurrence is processed; the next daily occurrence is calculated from the current time, avoiding catch-up message bursts.

## Official templates

Use an APPROVED MARKETING template in the exact language selected, with a DOCUMENT header and numbered body parameters. Set the ordered parameter array in the draft. `{{customer_name}}` and `{{store_name}}` are supported substitutions. For example `["{{customer_name}}", "{{store_name}}"]` supplies two text parameters if that matches the approved template. A free-text draft caption is only used for linked-device messages. For official messages, Meta's approved template body is used. This version does not support named template parameters or dynamic/quick-reply buttons. Include STOP opt-out instructions in your approved template.

The server uploads the PDF to WhatsApp and sends the document using the approved template. Credentials remain server-side and tokens stay encrypted. Official app configuration, number readiness, billing and provider messaging limits must already be valid. This build does not promise that provider approval or delivery will succeed.

## Subscriptions and logs

- A customer must have recorded marketing consent. Consent and the phone number are checked again before dispatch.
- A phone number receives at most one message in a run even if it exists in multiple customer records.
- Incoming exact STOP or UNSUBSCRIBE messages remove marketing consent from matching customer records for either connection.
- Pausing skips messages that have not yet started. A message already submitted cannot be recalled.
- Disabling a client's application access prevents new campaign dispatches.
- Accepted means the provider accepted a message, not delivered/read.
- Unknown means acceptance could not be determined, including a timeout or server interruption. Such messages are not automatically retried; review provider logs before scheduling a replacement. Any run with uncertain/failed results stops its daily recurrence and requires review.
- Logs and schedules live in the existing server database, not browser storage.

## Current limits

One server process should own this database and linked-device worker. Schedules require that process to be running. Bulk sending is sequential at approximately one message every 1.5 seconds, subject to provider/API limits. The app does not provide distributed workers, automatic retry of uncertain sends, delivery/read-receipt reconciliation, campaign editing, PDF retention cleanup or payment automation. PDF generation and live WhatsApp delivery have not been verified here because package download/network access was unavailable. Scheduler and account behavior are verified with offline tests.
