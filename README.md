# Grasp Infotech — Billing App (Multi-Staff / Cloud version)

Same colorful billing app, but now every staff member logs in and shares the same live
data — invoices, parties, business details — synced across all devices via Supabase
(a free hosted database), deployed as a static site on Netlify.

## Step 1 — Create a free Supabase project
1. Go to https://supabase.com → Sign up → "New project"
2. Pick any name (e.g. `grasp-infotech`), set a database password, choose a region close to you
3. Wait ~2 minutes for it to finish setting up

## Step 2 — Create the database tables
1. In your Supabase project, open **SQL Editor** → **New query**
2. Open `supabase-schema.sql` (included here), copy all of it, paste into the editor
3. Click **Run** — this creates the invoices/parties/profile/counters tables and staff-access rules

## Step 3 — (Recommended for a smooth staff experience) turn off email confirmation
By default Supabase requires staff to click a confirmation link before their new account works.
For a small internal team this is usually unnecessary friction:
1. **Authentication** → **Providers** → **Email**
2. Turn off **"Confirm email"**
3. Save

(You can leave it on if you'd rather staff verify their email first — just mention it to them.)

## Step 4 — Connect the app to your project
1. In Supabase: **Settings** → **API**
2. Copy the **Project URL** and the **anon public** key
3. Open `index.html` in a text editor, find this block near the top:
   ```html
   <script>
     window.SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
     window.SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
   </script>
   ```
4. Replace both placeholder values with what you copied, and save the file

## Step 5 — Deploy to Netlify
**Easiest — drag & drop:**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder (`index.html`, `logo.svg`, this README) onto the page
3. You get a live URL immediately — share it with your staff

**Using Netlify CLI:**
```bash
npm install -g netlify-cli
cd grasp-infotech-erp-cloud
netlify deploy --prod
```

## Step 6 — Roles & Permissions: Admin decides everything
There is **one fixed Admin** (100% access, including assigning access to everyone else).
Every new signup starts as plain **Staff** with no special access. The Admin can, per person:
- Set a **designation** (just a label for reports: Staff / Sales / Service / Manager / Accountant)
- Toggle **Purchase Bills** access
- Toggle **Confirm Payments** access (mark invoices as paid/partial)
- Toggle **Business Details** access (edit address, GSTIN, bank, UPI, terms)
- Toggle **View All Sales** — if OFF, that person only sees their *own* Sale Invoices/Quotations
  and their own Outstanding (great for Sales/Service staff tracking their own numbers)
- Set a **Sales Target** (₹) — shown as a target/achievement progress bar on their Home screen

Make yourself the Admin (do this once, after signing up in the app):
```sql
update grasp_users set is_admin = true, designation = 'Admin',
  can_view_purchases = true, can_confirm_payments = true,
  can_edit_business = true, can_view_all_sales = true
where email = 'you@example.com';
```
Then in the app, go to **Account → Manage Staff** to configure everyone else.

## Step 7 — Add your other staff
Anyone with the site link can create their own account from the login screen. If you'd rather
they not self-signup, remove/hide the "Create Account" option and create accounts for them
manually instead, from Supabase → **Authentication** → **Users** → **Add user**.

## Extra features
- **Convert Quotation → Invoice**: open any Quotation and tap "Convert to Invoice" — creates a
  new Sale Invoice with the same details and a fresh invoice number; the quotation is marked
  "Converted" so it isn't converted twice.
- **Purchase cost tracking + margin alerts**: whenever a Purchase Bill is saved, each item's rate
  is remembered as its cost. When quoting/invoicing that same item name again, if the selling
  rate is below the last known cost, a red "Nuksan!" (loss) warning appears right on that item
  row — before the document is even saved.
- **Manage Items**: a dedicated screen (Business → Manage Items, visible to Purchase-access staff
  and Admin) to explicitly add/edit items with cost, selling rate, HSN, and GST% — these appear
  as autocomplete suggestions when creating any document.
- **Per-item GST%**: each line item can have its own GST rate (defaults to 18%, override to 5%
  or anything else per item) instead of one rate for the whole document.
- **IGST vs CGST/SGST**: automatically detected by comparing the invoice's Place of Supply against
  your Business State (Business Details → State). Different state → IGST; same state → CGST+SGST.
- **GST & P&L Reports** (Business → GST & P&L Reports): pick any month and see Output Tax (from
  sales), Input Tax (from purchases), Net GST Payable/Credit split by CGST/SGST/IGST, Gross Profit
  & margin, and cash flow (received/outstanding/paid/payable) — everything needed for monthly
  GST filing and profit tracking.
- **Delivery Challan**: a 4th document type alongside Sale/Purchase/Quotation, for goods movement
  without a tax invoice (job work, returnable items, etc). Not counted in GST/P&L reports.
- **TDS tracking on Purchase Bills**: when recording a vendor payment, you can enter both the
  amount actually transferred and any TDS deducted at source — both count toward settling the
  bill, and TDS shows separately on the printed bill and in the balance calculation.
- **Share as PDF**: "Print / Save PDF" opens the browser's native print dialog — set destination to
  "Save as PDF" to get a real PDF file, which you can then share via WhatsApp/email from your
  phone's file/download manager. "Share text" sends a quick text summary instead. (An earlier
  version tried to generate the PDF directly in-app, but it had rendering bugs on some phones —
  the native browser print dialog is far more reliable across devices.)
- **Company & Banking Details moved behind a button**: to prevent accidental edits, business
  name/GSTIN/bank/UPI/terms now live on their own screen (Business → Company & Banking Details)
  instead of being directly editable on the main Business page.
- **Auto Discount**: every Sale/Purchase/Quotation/Challan has a Discount field (choose % or ₹)
  right in the totals section — enter it once and the taxable amount, tax, and total all
  recalculate automatically. The discount is distributed proportionally across items so each
  item's own GST rate is still respected correctly.
- **Document folders on Home**: quick-access buttons for Sale Invoices, Quotations, Delivery
  Challan, and Purchase Bills (Purchase only shown to staff with purchase access) — tap one to
  jump straight to that filtered list. The "Recent" section still shows everything mixed together
  as before. Inside "All Documents" you can also switch between type filters with the chip row.
- **Expenses** (Home → Business Tools → Expenses): track rent, electricity, salaries, transport,
  marketing, and other business costs by category, month by month.
- **Payroll & Incentives** (Home → Business Tools → Payroll & Incentives, Admin only): set each
  staff member's monthly salary and incentive % (commission on their sales) in Manage Staff, then
  the Payroll screen auto-calculates their incentive from that month's actual sales, lets you
  adjust the net payable (e.g. for deductions), and mark it paid with a date.
- **Net Profit in Reports**: GST & P&L Reports now subtracts Expenses from Gross Profit to show
  a true Net Profit and Net Margin % for the month.

## What's different from the offline version
- Data lives in Supabase (cloud Postgres), not the browser — works across devices and staff
- Requires login (email + password) before using the app
- Needs an internet connection to load/save (no offline mode)

## Limitations / good next steps
- Only two roles (staff / accountant) — no finer-grained permissions (e.g. "can create but not delete")
- No in-app password reset flow (use Supabase dashboard to reset a user's password if needed)
- No audit log beyond `created_by` on each invoice
- Payroll is calculated per calendar month using each invoice's date; it does not yet handle
  mid-month staff transfers or pro-rated salaries — the Net Payable field can be hand-adjusted
  for those cases.

Happy to add finer roles, an audit log, or a password-reset screen if you'd like — just ask.
