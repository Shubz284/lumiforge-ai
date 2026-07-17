Because that project had a CreditTransaction (ledger).
They wanted the history to look like:

+2000  PURCHASE
+200   BONUS

instead of
+2200 PURCHASE
That's useful if you want users to see where each credit came from

Razorpay is done.
The only things you might add later are enhancements, not core functionality:

🧾 Payment history page (GET /payments)
📄 Invoice/download receipt
🔄 Refund support (and deduct credits if appropriate)
📊 Admin dashboard for payments
📧 Email confirmation after successful purchase
📈 Analytics (revenue, top packs, conversion rate)