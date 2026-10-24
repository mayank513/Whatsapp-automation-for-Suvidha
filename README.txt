MARKET LOOP — LIVE GOOGLE SHEETS PRODUCTS AND ORDER EXPORT

INSTALL
1. Stop MarketLoop if it is running (Ctrl+C in its server window).
2. Extract this ZIP into a new folder. Do not extract over the running CRM folder.
3. Double-click Install-Google-Sheets-Orders.cmd.
4. When asked, type YES. The installer saves a timestamped backup, copies the update into:
   C:\Users\DAMON\Downloads\Whatsapp CRM client\MarketLoop
   It preserves .env, the database, WhatsApp sessions, and dependencies.
5. If your MarketLoop installation is in a different folder, edit the target path near the top of update-and-start.mjs before running the installer.

GOOGLE SETUP (ONE TIME)
In the same Google Cloud project, enable both Google Sheets API and Google Drive API. The Drive API is used only to list spreadsheet names and IDs for the dropdown. In the OAuth consent screen, add your Google account as a test user while the app is in testing. Create/use a Web application OAuth client. Add this exact redirect URI for the local CRM:
http://127.0.0.1:3080/api/sheets/callback

In the CRM installation's private .env file, set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET. Set TOKEN_ENCRYPTION_KEY to a stable 64-character hex key (keep an existing key unchanged). Set PUBLIC_ORIGIN=http://127.0.0.1:3080 for local use. Restart MarketLoop after saving .env. Never put these values in browser code or share them in chat.

PRODUCTS AND SHEET EDITING
1. In Products & stock, press Connect Google account and authorize the Google account that owns or can access the spreadsheet. Reconnect if asked to grant the Drive spreadsheet-list permission.
2. Select the spreadsheet, choose a tab from the tab dropdown, then select Save and show sheet. The selected tab appears in the live grid. Product rows with product columns are imported into Products & stock; other tabs such as Orders are shown as regular tables.
3. The live grid starts locked. Choose Unlock sheet editing, edit one or more rows, then select the single Save changes button above the grid. All edited rows are written to Google Sheets together. Product tab changes also sync into Products & stock. Lock sheet editing prevents edits in both the UI and server API.

ORDERS
1. In Orders, select the spreadsheet from the dropdown. Use Refresh spreadsheet list for a newly created sheet. Choose the Orders tab and save.
2. Ensure row 1 in the Orders tab contains these four headers:
   Name | Customer Address | Order Details with Quantity | Order Completion Status
3. Existing sheet rows load into an editable table on the Orders page. Use Lock sheet editing / Unlock sheet editing, edit rows, then select Save changes to write all edits to Google Sheets. Press Send to Sheets beside a CRM order to append it. New CRM orders are written as Pending. Each press appends one row; do not press twice for the same order.


The CRM code is updated in this package. The Downloads installation is updated only after you run the installer.
