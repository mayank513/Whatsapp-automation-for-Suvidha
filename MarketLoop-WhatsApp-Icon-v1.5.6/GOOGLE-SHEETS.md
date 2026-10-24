# Google Sheets → Products & stock (1.3.0)

The product page now includes Google account connection, spreadsheet/tab selection, validated import preview and optional background updates. The sheet can stay private. MarketLoop reads from Google Sheets; dashboard edits are not written back to the sheet.

## Install
Stop the running server, extract the complete ZIP into a separate folder, run Update-And-Start.cmd and restart. Existing database, .env and WhatsApp sessions are preserved. Open Products & stock. This development session has not updated your Downloads installation.

## Server setup once
1. In Google Cloud, choose/create the app project and enable the Google Sheets API.
2. Configure the OAuth consent screen for the appropriate audience and add permitted test users if the app is in Testing. Review Google's publishing/verification requirements before offering it to external clients.
3. Create an OAuth client of type Web application. Add the exact authorized redirect URI for this installation:
   - Local: http://127.0.0.1:3080/api/sheets/callback
   - Hosted: https://YOUR-DOMAIN/api/sheets/callback
4. Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the private server .env (or production EnvironmentFile). Set PUBLIC_ORIGIN to the matching application origin. Keep TOKEN_ENCRYPTION_KEY as your existing stable 64-hex key; if none exists, generate it using the instructions in .env.example. Never place secrets in browser files or paste them into chat.
5. Restart the app. Background updates are available unless GOOGLE_SHEETS_WORKER_ENABLED=false. They only run for stores that explicitly enable automatic updates.

## Connect a supermarket's sheet
1. Sign in to that supermarket dashboard through its WhatsApp QR.
2. Open Products & stock → Connect Google account. Complete Google's read-only authorization with an account that can view the product sheet.
3. Paste the spreadsheet URL or ID and enter the exact sheet tab name, for example Products. Save settings.
4. Select Preview product update, inspect row counts/details and click Apply product update. The product list and database update together.
5. Optionally enable automatic updates. They refresh product details/prices about every five minutes while the server is running. A visible product page checks for refreshed records about every minute. Manual previews can be invalidated by concurrent store activity; refresh and preview again if prompted.

The requested scope is spreadsheets.readonly. Google's consent grants read-only access to spreadsheets available to the selected account, not only one sheet; MarketLoop reads the spreadsheet/tab chosen in this store's configuration. It does not request write access. Each store's connection and draft imports are isolated by its authenticated owner ID. Admin users do not use client sheet endpoints.

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
