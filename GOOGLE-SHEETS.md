# Google Sheets → Products & stock (1.4.0)

The product page lists the tabs in the selected Google spreadsheet and displays the selected tab in an editable table. Product tabs with the required product columns sync into Products & stock. Other tabs, including Orders, remain visible and can be edited in the table. Unlock the sheet to edit cells; each saved row is written to Google Sheets. The Orders page can also append selected CRM orders into a Google Sheet.

## Install
Stop the running server, extract the complete ZIP into a separate folder, run Update-And-Start.cmd and restart. Existing database, .env and WhatsApp sessions are preserved. Open Products & stock. This development session has not updated your Downloads installation.

## Server setup once
1. In Google Cloud, choose/create the app project and enable both the Google Sheets API and Google Drive API. MarketLoop requests Sheets access and read-only spreadsheet file metadata so it can show spreadsheet names in a dropdown; it does not list or read the contents of unrelated Drive files.
2. Configure the OAuth consent screen for the appropriate audience and add permitted test users if the app is in Testing. Review Google's publishing/verification requirements before offering it to external clients.
3. Create an OAuth client of type Web application. Add the exact authorized redirect URI for this installation:
   - Local: http://127.0.0.1:3080/api/sheets/callback
   - Hosted: https://YOUR-DOMAIN/api/sheets/callback
4. Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the private server .env (or production EnvironmentFile). Set PUBLIC_ORIGIN to the matching application origin. Keep TOKEN_ENCRYPTION_KEY as your existing stable 64-hex key; if none exists, generate it using the instructions in .env.example. Never place secrets in browser files or paste them into chat.
5. Restart the app. Background updates are available unless GOOGLE_SHEETS_WORKER_ENABLED=false. They only run for stores that explicitly enable automatic updates.

## Connect a supermarket's sheet
1. Sign in to that supermarket dashboard through its WhatsApp QR.
2. Open Products & stock → Connect Google account. Complete Google authorization with an account that can edit the product/order sheet. If already connected, choose Reconnect Google account and approve the additional Drive metadata permission.
3. Choose a spreadsheet from the Google spreadsheet dropdown, select the exact sheet tab name (for example Products), then save settings. Use Refresh spreadsheet list if you created a sheet after connecting.
4. Saving settings immediately loads the sheet rows into the visible product grid and imports them into Products & stock. Refresh sheet and product list repeats the import; automatic updates still refresh product details/prices about every five minutes while the server is running.
5. The sheet starts locked. Choose Unlock sheet editing to edit product fields and Save row to write the row to Google Sheets and update Products & stock. Lock sheet editing blocks edits in both the page and server API.

For product import, choose the spreadsheet and Products tab and use preview/apply as above. For orders, open Orders, choose the same or another spreadsheet from the dropdown, select the `Orders` tab, then save the destination. Use Send to Sheets on an order. It appends Name, Customer Address, Order Details with Quantity, and Order Completion Status in that order. The first order status `New` is written as `Pending`. The sheet must already have those four headers in row 1. Each click appends a row, so avoid sending the same order twice. Each store uses its own authenticated Google connection and CRM account.

## Sheet columns
Use the downloadable template on the product page, or put this header in row 1:

sku | name | brand | unit | price | stock | lowStock
--- | --- | --- | --- | --- | --- | ---
RICE-1KG | Basmati rice | Example | 1 kg | 120 | 25 | 5
MILK-1L | Milk | Example | 1 litre | 60 | 40 | 8

Required: sku, name, unit, price, stock. Optional: brand, lowStock (default 5). Headers are case-insensitive and may be reordered. Keep SKU cells formatted as text so leading zeros are preserved. Every SKU must be unique and stable. Prices must be numeric INR values with at most two decimal places; quantities must be nonnegative numbers. Use up to 2000 product rows, with columns within A:AZ. A sheet with invalid rows is rejected as a whole.

## Stock and data rules
- Imports add new products and update products previously imported from the same spreadsheet and SKU. Manual products are not matched by name or overwritten. Existing imported product IDs stay stable so historical orders retain their links and agreed prices.
- Automatic updates preserve existing available stock. New products use the sheet's initial stock. This prevents a scheduled refresh from undoing order reservations.
- To import changed available quantities, explicitly select Also replace existing available stock for a manual preview. Treat these sheet numbers as current sellable quantities after existing commitments. Concurrent orders/edits invalidate the preview rather than applying stale quantities.
- Missing rows never delete saved products. Changing SKU or spreadsheet identity creates a new product. Review old records in the dashboard if discontinuing or replacing them.
- Disconnect stops this store's updates and removes its saved local Google credentials. Imported products stay. To revoke the app's Google-side authorization as well, use your Google account's third-party access controls; revoking a shared Google authorization can affect other connections using that same Google account.
- Database backups include encrypted connection tokens. Keep the server encryption key backed up separately and private; after key loss/rotation reconnect the Google account.

## Verification status
Automated tests cover OAuth state ownership/replay, safe input parsing, preview-before-apply, tenant isolation, stale data, atomic rollback, stable products, stock protection, automatic updates and disconnect. Google OAuth/API calls are mocked in these tests. No actual Google sheet has been connected during development because installation credentials and a sheet were not supplied. Follow the setup above and verify a small real import before enabling background updates.
