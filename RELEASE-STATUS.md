# v1.5.6 WhatsApp menu icon

Replaced the WhatsApp Chats sidebar placeholder with an inline WhatsApp phone-and-chat logo. The icon inherits navigation colors and requires no external font or image download. Client script URL is versioned to load the update. Messaging behavior is unchanged.

# v1.5.5 message identity compatibility

Live read-only diagnostic copies of the installed v1.5.4 database showed baseline lists of 16 and 17 messages with every serialized ID empty. The prior confirmation code rejected those messages even though they appeared in the chat. Message identity now accepts the underlying WhatsApp message-key ID when _serialized is absent, in both raw send receipts and history reconciliation. Legacy baselines consisting only of empty identifiers are not used to confirm historical sends.

Added regressions for native IDs without _serialized, post-send errors with native IDs and normalized message-history IDs. Existing send deduplication, no automatic retry, draft retention for genuine failures and silent clearing after confirmation remain. No real message was sent and the Downloads installation was not modified during development.

# v1.5.4 delayed send confirmation

Before each manual reply, save existing message IDs. If sending errors after the message has reached WhatsApp, confirm against a unique new outgoing message with the same content hash. A tenant-scoped send-status endpoint persists acceptance without sending again. The client checks this before showing a failure notice and on later message refreshes, clears the matching draft and removes stale uncertain-send notices once confirmed. Old or incoming messages cannot confirm a send. Normal accepted sends show no toast, and the composer footer now only describes keyboard shortcuts.

No live messages were sent or store connections changed during testing. Live behavior requires checking after installation.

# v1.5.3 post-send confirmation correction

Read-only diagnostics of the installed app showed eight Unknown sends without returned receipts while outgoing messages appeared in the UI. The library send method serializes the message after sending; a failure at that point kept the draft. Manual text replies now capture the raw WhatsApp message ID first, without running the optional serializer. If sending throws after insertion, only a uniquely observed new outgoing message in the same chat can supply the receipt. Older matching messages cannot confirm a send. There is no resend fallback. The existing accepted-send composer clearing remains.

No live message was sent during development. Actual send/clear behavior needs verification after installing this update; the Downloads app was read for diagnostics but not modified.

# v1.5.2 reply composer clearing

Accepted replies now clear the active composer even if the chat panel was replaced while sending. The submitted draft is removed, newer draft text is preserved and focus returns to the reply box. Failed or uncertain sends retain their text. No real messages were sent during verification.

# v1.5.1 profile photo loading fix

The library profile-photo helper used full chat conversion, which can fail on the same accounts requiring the minimal chat-list fallback. Added raw-chat profile-photo lookup and an authenticated same-origin image endpoint to avoid direct browser requests to WhatsApp CDN hosts. Downloads allow only WhatsApp CDN HTTPS image responses with bounded size, time and validated redirects.

Provider mocks cover raw lookup, image transfer and unsafe response rejection. Actual profile-photo visibility requires verification with the connected store phone. No store connection was reset and no messages were sent.

# Version 1.5 WhatsApp-style chats and profile photos

Restyled conversations with WhatsApp light colors, search/filter controls, timestamps, provider-backed read receipts, mobile chat/back navigation and a bottom reply bar. Added authenticated tenant-scoped WhatsApp profile-photo reads with short negative caching and CDN-only URLs; privacy-hidden and unavailable photos use fallback avatars. Existing single QR flow is unchanged.

The user confirmed chats fetch correctly and disconnected the phone intentionally. No reconnection or messages were performed for this change. Automated UI and photo isolation checks passed. The browser could not reach the temporary layout preview, so screenshot-based visual verification was not completed. Live profile-photo retrieval needs checking after installation and reconnection.

# v1.4.2 chat loading compatibility

Added a minimal-field fallback when the WhatsApp library full chat serializer fails. The same path supports selecting a chat without full serialization. Tests cover broken/locked model filtering and fallback conversation access. Actual phone history and delivery still require live verification; the installed app has not been modified by this build.

# Version 1.4.1 single QR login

Client login hands the verified persistent WhatsApp client to store services. Chats has no separate QR. Same-client handoff and disabled-access rejection are covered by tests. Real phone pairing and delivery remain untested.

# Version 1.4 WhatsApp Chats verification

- Source syntax checks passed; all 81 automated tests passed.
- New checks cover tenant isolation, locked chat filtering, message limits, reply idempotency, uncertain-send handling and revoked access during reads.
- Real WhatsApp pairing, history sync and message delivery have not been exercised.
- Complete source update prepared; the Downloads installation has not been changed or restarted.
- Open WhatsApp Chats after installation and link the store messaging connection once.

# Release 1.0.0 verification status

Date: 18 October 2026 (Asia/Kolkata).

## Executed successfully
- All source syntax checks passed.
- 55 automated tests passed; no failures or skipped tests.
- Real PDFKit multipage catalogue generation passed.
- Real QR library generated a valid PNG QR code. This was a synthetic payload, not an authenticated WhatsApp session.
- Installed WhatsApp library imported with Client and LocalAuth available. Browser startup/login was not exercised.
- Account/tenant API tests, ordering, stock, fulfilment, consent, admin access revocation and audit tests passed.
- Mock-backed Razorpay signature, captured amount/currency, replay, receipt and rollback tests passed. No real payment was made.
- Production runtime validation and database/PDF backup/restore tests passed, including committed WAL data, corrupt-file detection and cleared restored sessions.
- Local doctor passed runtime, dependency availability and data-directory write checks using a workspace copy of existing installed dependencies.

## Not executed / blocked
- npm registry DNS lookup failed (ENOTFOUND registry.npmjs.org). A new clean dependency install and lockfile generation could not complete here. Existing installed dependencies were copied read-only from the Downloads installation into this workspace for smoke tests. The Downloads installation was not modified.
- Actual customer WhatsApp QR pairing, Meta onboarding, message delivery and public webhook round trips remain to be tested with configured accounts.
- Linux Caddy/systemd runtime checks, DNS, TLS, reboot recovery, offsite backup setup and uptime monitoring require the actual target server.
- No VPS/domain or authenticated deployment connection was supplied. Nothing has been published to a live production host.
- Source changes and updater are prepared in the workspace; the user's Downloads app has not been updated or restarted by this session.

## Included operations tooling
- runtime.mjs: production HTTPS/cookie/key/persistent-data validation.
- doctor.mjs: local runtime/dependency/storage checks; npm run doctor.
- backup.mjs: online SQLite snapshot plus referenced PDFs, integrity/checksum manifest, empty-directory restore with session invalidation.
- deploy/: systemd app restart service, nightly backup service/timer, Caddy proxy and private production environment template.
- DEPLOYMENT.md: installation, hosting, migration/recovery and live acceptance instructions.

Step 9 is complete for the automated/local checks listed above; live provider acceptance remains pending. Step 10 deployment files are prepared; actual hosted deployment is pending server/domain access and configuration.


1.0.1 logout update: changed server/client/logout scripts passed syntax checks; account API and UI regression tests passed (3 tests). Added checks for public logout page, cross-origin sign-out rejection, session invalidation and repeat sign-out. The earlier full 55-test run remains documented above.


1.1.0 login portal update: 61 tests passed, zero failures/skips. Changed scripts passed syntax checks. Main page and client/admin pages are served by the backend; QR identity registration and challenge proof checks are covered by mocked provider tests. Real WhatsApp phone pairing and live QR login acceptance remain pending. No Downloads installation files were modified during this update.


1.2.0 QR-only client update: all 63 automated tests passed with no failures/skips. Changed scripts passed syntax checks. Client password/setup links and separate QR enabling panel are removed from the visible flow. First verified scans can create a workspace atomically; repeat scans reuse the mapping and disabled identities remain blocked. Real phone acceptance remains pending installation.


1.2.1: Removed dashboard WhatsApp connection UI and its sidebar/overview links. Changed client syntax passed; account API and UI regressions passed (3 tests). Client QR login remains. Update/restart the Downloads installation to apply this release.


1.2.2: Added shared logout menus to both store/profile icons. Changed scripts passed syntax checks; account API/UI regressions passed (3 tests), plus an isolated interaction check for both buttons and the shared sign-out action. The running Downloads copy still requires the updater.


1.2.3: All 64 automated tests passed, including HTTP redirects for signed-in/out clients, cross-tab challenge reuse and successful-session detection. Changed backend/portal and landing inline scripts passed syntax checks. Decorative landing QR removed. Live phone scan remains pending installation.


1.2.4: All 64 automated tests passed. Password/legacy client sessions are explicitly tested as denied access to the store API and still shown the QR page; QR-verified fixture sessions are allowed and skip rescanning. Same-origin embedded QR route is tested. Landing QR is live and shares the real client login flow; successful embedded login navigates the full window. No real phone was paired during this update.


1.3.0: Full regression suite passed (72 tests), followed by 9 passing sheet tests including the added OAuth-disconnect race test; 73 unique automated tests pass. Product Sheets panel render check and changed script syntax checks passed. Google API/OAuth calls remain mocked; no real sheet was connected. Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, stable TOKEN_ENCRYPTION_KEY and exact redirect URI using GOOGLE-SHEETS.md, then validate a real import. Downloads installation is unchanged.


1.3.1: All 76 automated tests passed. Fixed missing sidebar profile toggle and null handling that prevented logout menus from initializing. Added visible header Logout. Signed-out confirmation redirects to client QR login after 1.8 seconds; failure paths do not claim success or redirect. Changed scripts passed syntax checks. Downloads installation has not been modified by this session.

Latest v1.4.1 verification: 83 tests passed, zero failures; all source syntax checks passed.

Latest verification: source checks and all 85 automated tests passed.

Latest v1.5 verification: all source checks and 89 automated tests passed.

Latest v1.5.1 verification: source checks and all 92 automated tests passed.

Verification for v1.5.2: client script syntax and all 8 UI tests passed, including accepted-send clearing and failed-send draft retention.

Latest verification: modified provider/module syntax checks and all 96 automated tests passed.

Latest verification: modified source syntax checks, all 98 automated tests, and a final UI regression rerun passed.

Latest verification: modified module syntax checks and all 101 automated tests passed. Live send/clear verification remains after installation.

Verification: client script syntax and all 8 UI regression tests passed.
