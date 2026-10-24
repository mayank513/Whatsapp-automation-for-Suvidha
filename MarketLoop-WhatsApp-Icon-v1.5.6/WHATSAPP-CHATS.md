# WhatsApp Chats - version 1.4.1

Extract the complete release and run Update-And-Start.cmd. Existing clients should sign out and scan the client login QR once after upgrading. That scan both verifies the store owner and keeps the same WhatsApp client connected for chats and the existing store messaging services. Open WhatsApp Chats to see conversations directly; there is no second QR on that page.

Website logout ends dashboard access while keeping store messaging linked. A future login still requires the login QR if the website session has ended. An active website session opens the dashboard directly. Saved WhatsApp profiles restore automatically on dashboard connection checks after a server restart. If WhatsApp revokes the linked device, use Reconnect through client login to sign out and perform a fresh login scan.

This connection supports the existing linked-device messaging services. Store settings, customer consent, automation activation, products and payment/Google credentials still need to be configured as applicable; scanning does not authorize or configure third-party services.

Up to 100 recent conversations and 50 or 100 available messages are shown. WhatsApp controls history synchronization. Locked chats are excluded; groups are view-only; media uses placeholders. Replies send only when you click Send. Acceptance is not proof of delivery. Uncertain requests are not automatically retried; check the phone before composing another send.

Verification uses provider mocks. Real phone pairing, session restoration, chat sync and delivery must be verified after installation. No real messages were sent during development. The running Downloads installation has not been modified by this release preparation.

## v1.4.2 chat loading fix
If full chat conversion fails, the page reads basic conversation fields directly from the same tenant WhatsApp session. Broken entries are skipped. The single client-login QR flow is unchanged. Install the complete update, restart and use Refresh chats.

## Version 1.5 appearance and photos
WhatsApp-style light chat list, All/Unread/Groups filters, conversation header, message timestamps, real provider receipt indicators and bottom composer. On mobile, selecting a chat opens the thread and the back arrow returns to the list. Enter sends; Shift+Enter adds a line. Profile photos load lazily in both the list and header through the signed-in store connection. WhatsApp privacy settings, missing photos or provider/network failures can prevent a photo from being shown; those chats retain the default avatar. This is a custom CRM interface, not the WhatsApp Web app itself.

## v1.5.1 profile photo fix
Profile photo lookup now avoids full chat serialization when needed. Available images are served through an authenticated MarketLoop image endpoint rather than loaded directly from a remote CDN by the browser. Refresh chats clears the page photo cache. Contacts whose WhatsApp photo is unavailable still display a placeholder.

## v1.5.3 send confirmation
Fixes replies that reached WhatsApp but were reported as uncertain because later message conversion failed. The app captures the raw message ID, returns acceptance and clears the composer. No message is retried automatically. Genuine uncertain sends still retain the draft. The chat script includes a release version in its URL to load the current code after updating.

## v1.5.4 delayed confirmation
Replies are reconciled against outgoing messages added after each send began. Confirmed replies clear the typing bar without a warning or success popup, including when the original provider response failed. Truly unconfirmed sends keep their drafts and are never automatically resent.

## v1.5.5 message identity fix
Supports WhatsApp message keys where the _serialized property is absent. This corrects sends reaching the conversation but remaining unconfirmed and leaving text in the composer. Install, restart the server and refresh the dashboard to load the new release.
