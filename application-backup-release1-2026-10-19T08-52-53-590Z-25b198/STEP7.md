# Step 7 — payments and receipts

Version 0.7.0 adds tenant-specific Razorpay payment links, signed webhook reconciliation, printable acknowledgements and consent-based WhatsApp payment messages. No live payment was made during development. Gateway tests use mocks; real Razorpay and WhatsApp end-to-end delivery still need validation on your server.

## Install
Extract the complete ZIP into a separate folder. Stop the existing server with Ctrl+C. Run Update-And-Start.cmd and type YES. It backs up application files in the specified Downloads/MarketLoop folder and preserves .env, data, WhatsApp sessions and node_modules. Then open http://127.0.0.1:3080/client. These changes have not been applied to your Downloads folder automatically.

## Configure each supermarket
1. Sign in and open Payments. Copy the Store ID.
2. Copy payment-merchants.example.json to a private server file named payment-merchants.json. Replace STORE_OWNER_ID with the exact ID. Enter that store's Razorpay TEST key ID, key secret and separately configured webhook secret. Keep credentials server-side; do not commit them or put them in dist.
3. Set RAZORPAY_MERCHANTS_FILE to the absolute private JSON path in .env and PAYMENTS_ENABLED=true. Set the merchant enabled=true, mode=test. Restart the server.
4. On a public HTTPS deployment, configure Razorpay webhook URL https://YOUR-HOST/api/webhooks/razorpay/STORE_OWNER_ID/test. Subscribe to payment_link.paid, payment_link.partially_paid, payment_link.cancelled and payment_link.expired. localhost cannot receive Razorpay webhooks directly. Signature validation uses the raw body. Keep old webhook secrets in previousWebhookSecrets while retries may still use them.
5. Accept an order in Staff queue, create a TEST link in Payments and complete Razorpay test checkout. Reconcile using a captured pay_ ID if the link response does not contain its payment list. Check the TEST receipt; the real order must remain Unpaid.
6. In Staff queue → Team & notifications enable payment links/receipts, verify customer service consent and select a connected WhatsApp mode. Outside the official 24-hour reply window, configure approved UTILITY templates with exactly three body parameters: order number, status, details. Test receipts cannot be sent as real confirmations. Automatic receipt messages acknowledge payment and reference the receipt; the printable PDF is accessed by the owner separately.
7. Only after validation, configure that merchant's live profile, mode=live and allowLive=true. Configure the separate /live webhook and its live secret. Run a controlled live verification appropriate to the business before broad rollout.

## Behaviour and limits
- Payments require accepted orders and server-calculated INR amounts. Signatures alone do not settle an order: the server fetches the gateway link and captured payment and checks reference, ownership, currency, full amount and refunds.
- Duplicate webhook bodies/captures do not create duplicate receipts. Uncertain link creation never automatically creates a second link; use Reconcile or inspect Razorpay by reference.
- Existing live links and verified captures block manual paid/refunded overwrites. Test settlement never marks a real order Paid. Payment and receipt writes share a database transaction.
- Customer notifications require the master notification switch, payment-specific switch and current service consent. Provider acceptance is not proof of delivery. See Staff queue notification logs.
- Late payments for cancelled orders are recorded with a review flag without reopening the order. Refund execution, refund reconciliation, chargebacks, settlements, tax invoices and automated gateway-link cancellation are not implemented; review them in Razorpay. Do not use an acknowledgement as a tax invoice.
- Creation can be disabled while prior configured webhook profiles continue to verify existing payments. Retain credentials required for pending reconciliation.
- Back up the database and private settings before updating. Run node --test or npm test for mock-backed verification.
