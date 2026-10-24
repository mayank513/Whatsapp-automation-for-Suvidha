# Step 8 — application administrator dashboard

Version 0.8.0 includes the complete project through Step 8.

## Install the complete update
1. Extract the full ZIP to a separate folder.
2. Stop your existing MarketLoop server with Ctrl+C.
3. Run Update-And-Start.cmd and type YES. The updater backs up application files in C:\Users\DAMON\Downloads\Whatsapp CRM client\MarketLoop, preserves .env/data/WhatsApp sessions, and starts the server.
4. Open http://127.0.0.1:3080/client. This update has not automatically modified your Downloads copy.

## Administrator setup
In the installed server's private .env set ADMIN_EMAIL to a separate administrator email and ADMIN_PASSWORD to a unique password of at least 12 characters. Restart the server and sign in at the same /client page. The account's role opens the administration workspace automatically. The public registration form only creates supermarket client accounts.

There is no default administrator password. ADMIN_EMAIL must not belong to an existing supermarket client; the server refuses that configuration. These variables create an account only if that email does not exist. Changing ADMIN_PASSWORD later does not reset an existing password. Password reset UI and administrator account management are not part of Step 8. Keep the .env private.

## Dashboard features
- Total, enabled, disabled and linked-device-connected supermarket counts.
- Search by store name, owner email or store ID; filter enabled/disabled clients.
- Store registration and last successful sign-in time, recorded from this release onward.
- Product/customer/order counts, linked-device state and official connection configuration.
- Details with store contact/address/timezone, active-order count, assistant and notification switches.
- Enable/disable access with a reason, stale-state checks and an atomic administrator audit record.
- Latest 200 access changes globally and per client, including administrator identity, previous/new access state and reason.

## Access behaviour
Disabling immediately commits the account state, removes all sessions and stops this server's linked-device client. Enabled-account checks block further dashboard requests and automation dispatch. Provider messages already submitted cannot be recalled. Official credentials remain stored, but client activity is blocked. Payment webhooks can still reconcile existing captured payments so disabling access does not hide money received.

Re-enabling does not restore old sessions: the supermarket owner must sign in again. Saved store data and configuration remain. Review saved campaigns and notification settings before reconnecting: enabled schedules may become eligible again. Pending notifications may have been skipped while access was disabled; they are not replayed automatically. Linked-device state reflects the current server process. Official 'configured' means credentials exist, not that the provider was reached or is healthy.

The administrator sees account-level usage and store contact details. Shopper contact lists, order contents, QR images, password hashes and provider secrets are excluded from these admin responses. This dashboard does not impersonate a client or edit their commerce records.

## Verification and remaining work
Run npm test (Node.js 24+) for automated regression checks. Tests cover authorization, tenant boundaries, disable/login/session behavior, stale changes, audit rollback, summaries and existing ordering/payment flows. Live browser/provider integration and production hosting remain Steps 9 and 10.
