# Step 6 - staff fulfilment and operational notifications (v0.6.0)

## Install and restart the existing project

This update includes steps 1-5. Extract the full ZIP into a temporary folder, stop the old server with Ctrl+C, then double-click Update-And-Start.cmd and type YES. It backs up application files, copies this version into `C:\Users\DAMON\Downloads\Whatsapp CRM client\MarketLoop` and restarts the server/browser. It preserves `.env`, the database, uploaded PDFs, WhatsApp sessions and dependency folders. The downloaded project cannot be modified directly by this assistant's restricted session, so this helper must be run by the user. Do not open dist/client.html as your live app; use the HTTP dashboard opened by the launcher.

## Staff queue

The signed-in store owner opens Staff queue. It shows active orders and filters for each stage. Manage an order to see its customer snapshot, quantities, pack sizes, payment record, delivery/pickup slot and staff assignment. Check each packed item before setting Packed. Item checks, assignment and slot instructions are saved on the order.

Delivery flow: New -> Accepted -> Packed -> Out for delivery -> Delivered.

Pickup flow: New -> Accepted -> Packed -> Delivered (collected).

Cancellation is allowed before completion, restores reserved stock once and never changes the payment record. Delivered and Cancelled are terminal. Invalid status jumps and stale queue edits are rejected. Status/assignment history is available from each order. The original Orders and Delivery screens also use the server's state checks; use Staff queue for the required packing checklist.

This is the owner's staff-management workspace, not independent staff logins. Staff user authentication/roles are not part of this step.

## Notifications

Open Staff queue -> Team & notifications. All notifications are off by default. Enter verified staff contacts, one per line: Name | international phone | YES or NO. YES records actual permission for operational WhatsApp alerts including customer/order details. NO allows assignment without WhatsApp alerts. Do not enter arbitrary phone numbers or assume permission.

Choose one sending connection (official or linked device). Enable the master setting and whichever notification types you want:

- New orders notify the permitted staff contacts.
- Assignments notify only the chosen permitted staff member.
- Customer status changes notify the order customer only when recorded service permission and the order's recipient number still match.

Enabling settings affects future events; it does not replay existing orders or old status changes. No alerts are sent merely by installing the update.

Order changes, status history and queued notifications commit in a single SQLite transaction. Notifications are dispatched by a background worker while the Node server is running. Set FULFILMENT_WORKER_ENABLED=false to pause the global worker if needed. By default it runs, but each store's notification settings remain off until explicitly enabled.

Permission, application access and connection mode are checked again just before sending. Customer updates superseded by a later order state are skipped, so delayed queues do not announce an outdated status. Staff new-order alerts are skipped if the order has been cancelled. Disabling application access also prevents these sends.

## Official WhatsApp templates

Within a recipient's recorded 24-hour official reply window, the server sends a free-text operational update. Outside it, configure separately approved UTILITY templates for staff and customers in the exact language saved in settings.

Each template must use exactly three numbered body parameters, without dynamic headers, dynamic URLs or quick-reply buttons:

1. Order number.
2. Customer name for the staff template; order status for the customer template.
3. Full notification text (order details for staff; slot/status/total for customer).

Example body: `Order {{1}} - {{2}}. {{3}}`

Do not assume that this example is already approved. The server validates approval, UTILITY category, parameter shape and language before sending outside the reply window. Staff detail longer than the template parameter limit is logged as failed rather than silently truncated. The full order always remains in the owner dashboard.

The unofficial linked-device mode needs a connected WhatsApp browser session. It sends plain text to the explicitly configured recipients; it carries the same reliability/account-restriction limits as earlier steps.

## Notification logs and retry behavior

- Pending: queued in the database.
- Sending: dispatch started.
- Accepted: provider accepted the message; delivery/read is not proven.
- Retrying: a definite pre-send connection failure can retry, up to three attempts one minute apart.
- Blocked/Failed: requires attention. The Retry button is available only for these definite outcomes, using current permission/settings.
- Unknown: a timeout, unexpected response or server interruption made acceptance uncertain. There is no automatic or safe-retry-button resend. Review provider logs first.
- Skipped: account/permissions changed or the update was superseded.

Replaying the same status change does not enqueue the same notification again. Notification delivery/read receipt reconciliation and automatic retry of uncertain sends are not implemented.

## Files

- fulfilment.mjs: status rules, packing validation, event history and durable outbox worker.
- fulfilment-adapter.mjs: selected WhatsApp transport, official template checks and permission rechecks.
- dist/fulfilment-step6.js: staff queue, packing/assignment form, settings and logs.
- database.mjs: transaction hook to atomically include history/outbox writes.
- server.mjs: tenant-authorized fulfilment APIs and worker startup.
- fulfilment.test.mjs: state, duplicate, permission, retry and recovery tests.

Run npm.cmd test for the complete offline suite. Tests use disposable databases/mocked transports and do not send messages. Live WhatsApp alerts still require verification with the real connection and configured recipients. Payment collection, refunds and gateway reconciliation are step 7 and remain unimplemented.
