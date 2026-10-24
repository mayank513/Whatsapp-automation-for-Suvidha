# Step 5 - WhatsApp ordering assistant (v0.5.0)

## Install into the existing project and restart

Extract the complete ZIP into a temporary folder. Stop the old MarketLoop terminal with Ctrl+C. Run `Update-And-Start.cmd` in the extracted folder and type YES. The updater copies an explicit list of application files to `C:\Users\DAMON\Downloads\Whatsapp CRM client\MarketLoop`, backs up the previous application files and starts the server. It does not copy over `.env`, private `data` or dependency folders. If you extract the source directly into the project, the updater simply starts it after you confirm the old server is stopped.

The source is packaged flat to avoid the nested Step4-Application folder problem. `Start-MarketLoop.cmd` remains the normal launcher after updating.

## What works

- Incoming text messages enter a durable per-store, per-customer checkout session.
- Named products are matched deterministically against names, brands and optional aliases. Ambiguous products are presented as numbered choices; unknown products are not substituted.
- Explicit quantities and compatible weight/volume units are converted into product pack counts. A partial packaged product is never silently sold; the customer is asked how many packs they want. Fractional quantities are supported only for products explicitly carrying `allowFractional: true` in their record.
- The customer chooses delivery or pickup, supplies their name, and for delivery supplies an address with an eligible 6-digit postcode.
- Delivery areas must contain configured 6-digit service postcodes. An unconfigured delivery area requires staff handover; the assistant does not assume delivery eligibility from a city name.
- TODAY/TOMORROW, same-day cutoff and configured slot selection use the store timezone.
- The customer chooses a payment preference. No gateway payment or automatic payment confirmation occurs.
- A final bill shows items, packs, quantities, agreed prices, delivery fees, total, recipient details and selected slot. Only an explicit CONFIRM creates the order and reserves stock. Staff still needs to accept and fulfil it.
- Prices, stock, minimum order and delivery-fee rules are checked again before confirmation. Changed prices require another review. Insufficient stock never creates an order.
- Duplicate message IDs and checkout IDs prevent double order creation and double stock reservation. A repeated CONFIRM after success returns the existing order reference.
- HUMAN/HELP pauses automated ordering; CANCEL abandons only the unsubmitted basket. EDIT restarts a basket. A confirmed order is not automatically cancelled/refunded.
- STOP/UNSUBSCRIBE removes promotional consent. Starting an order does not opt a customer into marketing.
- New customer records created during checkout record the service request and keep marketing consent false.
- Staff can review checkout stages and pause a conversation from the Ordering assistant page. Conversation content remains available in Inbox.

## Example

Customer messages, one line per turn:

```text
ORDER 2 x Milk, 1 kg Rice
PICKUP
Customer Name
TOMORROW
1
1
CONFIRM
```

Actual follow-up questions depend on your catalogue, prices, stock, payment preferences and slot configuration. Use exact catalogue names and separate items with commas, newlines or “and”. This is a deterministic text assistant, not an unrestricted AI interpreter. Voice notes, images, arbitrary multilingual shopping requests and unsupported phrasing require staff.

## Dashboard controls and safe testing

Open Ordering assistant in the sidebar. First use the simulator: it runs against a temporary copy of your existing catalogue and store rules. No real WhatsApp messages are sent; customer records, orders and stock are not changed in the real database.

Enable automatic service replies only after the product list, pack units, stock, rules and WhatsApp connection are ready. The setting is off by default. It applies only to incoming customer messages. Official replies stay within the 24-hour customer-service window; outgoing service replies are not broadcast campaigns.

The assistant's persistent state lives in `ordering_sessions` and `ordering_messages` in your existing SQLite database. Sender queues serialize rapid messages for one customer. Interrupted/uncertain replies are not automatically resent, preventing accidental duplicate communication. A failure to send an acknowledgement does not roll back an already confirmed order: the order reference and checkout ID preserve its identity.

## Files

- `ordering.mjs`: parsing, pack clarification, session state machine, service requests and duplicate protection.
- `order-core.mjs`: server-side quote calculations and confirmed-order stock reservation.
- `dist/ordering-step5.js`: assistant enable/disable control, session review, handover and simulator.
- `server.mjs`: incoming WhatsApp hooks, reply transport and assistant/simulator APIs.
- `ordering.test.mjs`: checkout behavior tests.
- `test.mjs`: isolated server API tests, including non-mutating simulations.
- `update-and-start.mjs` and `Update-And-Start.cmd`: exact-path update and restart helper.

## Limits

The browser host running before installation still serves the older source until the backend is restarted. This session cannot write to the user's Downloads folder, so the updater must be run by the user. No live order messages are sent during development/testing. WhatsApp Web sender IDs that cannot be resolved to an international phone number require staff; groups are not processed. Step 6 now implements staff/status notifications; see STEP6.md. Email/password recovery and automated payment links remain separate later work. The assistant is tested offline; live WhatsApp operation still needs verification on your linked number.
