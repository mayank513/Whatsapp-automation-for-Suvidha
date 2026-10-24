## Single QR client login - v1.4.1

The client login QR now creates the saved WhatsApp messaging connection and signs in to the dashboard using that same session. WhatsApp Chats opens without a second scan. Saved connections restore on dashboard status checks after restart. Older setup instructions describing separate login and messaging scans are superseded. Google Sheets, payment providers and official Meta API credentials still require their own initial configuration.

# Client login — QR only (1.2.0)

The Client login page is /client-login. It is the only visible client sign-in screen. Password/setup links have been removed and unauthenticated visits to /client redirect here. The main /login page still offers Client login and Admin login. Admins use their separate email/password page.

## Flow
1. Open the main page and select Client login.
2. Wait for the live WhatsApp QR.
3. Scan from WhatsApp Business → Linked devices → Link a device.
4. The server verifies the WhatsApp number and opens its supermarket dashboard. A first verified scan creates a private store automatically; later scans reuse that number's store. Disabled registered stores cannot create another account with the same identity.

There is no separate Enable QR sign-in step or customer password requirement for this flow. The previous registration panel is no longer loaded.

## Existing stores
Existing store data is preserved. If the QR sign-in browser already has a valid client dashboard session with no QR identity, the verified scan associates that existing store with the scanned number. An existing number mapping always takes priority, and no phone entered in store settings is treated as proof of identity. When no such authenticated session or verified mapping exists, the first scan creates a separate new store; it does not guess which older email-only account owns the number or move its data. Do not delete an older store to troubleshoot login.

## Installation
Stop the old server with Ctrl+C, extract the complete ZIP into a separate folder and run Update-And-Start.cmd. Open http://127.0.0.1:3080/login after restart. The updater preserves .env/data/WhatsApp messaging sessions. This session has not written changes into your Downloads installation.

## Technical limits
This uses the unofficial whatsapp-web.js linked-device integration, not Meta Embedded Signup. Scanning temporarily authorizes a WhatsApp browser device to verify the number; it is logged out afterward. A free linked-device slot, server Chrome, installed dependencies and network access are required. Persistent store messaging is configured separately inside the dashboard. Only scan on your trusted MarketLoop address.

Random HttpOnly challenge cookies, origin checks, expiry, one-use session consumption, bounded concurrent challenges and enabled-client checks remain. Client accounts are created only after the trusted WhatsApp ready event reports a valid number. Browser-supplied phone numbers cannot register or select a store. Account/identity/store creation commits atomically.

A real phone scan and live redirect remain to be acceptance-tested after installing this update. Automated tests mock the provider callback and cover first registration, repeat login, disabled accounts, replay, expiry and rollback.


1.2.3: All client entry buttons use /client-entry. Already signed-in enabled clients skip QR creation and enter /client. Anonymous /client requests redirect to /client-login. The landing page decorative QR is replaced with a client-entry button; no sample QR is presented as authentication. Pending challenges can be reused by other tabs in the same browser. After any tab completes verified QR sign-in, the others detect the session and redirect. Expired sessions must scan again. Admin login stays separate.


1.2.4 supersedes the prior generic session rule: only sessions with a server-recorded completed QR verification may open client dashboards/APIs. Existing older/password sessions must scan once after updating. Verified QR sessions remain valid until logout, revocation or expiry. The landing page embeds the same real /client-login flow; successful scanning navigates the top-level window. Admin authentication remains separate. Old client cookies can identify an existing store during the verified first scan, preserving its data, but cannot bypass QR verification.
