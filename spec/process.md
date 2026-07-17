
// Actual image download processs

R2 bucket (bytes stored)
   → stream starts flowing to your server
   → transformToByteArray() waits and collects the full stream into memory
   → Buffer.from() wraps it in Node's binary format
   → headers tell the browser "this is a webp image, save it, here's the filename, here's the size"
   → res.send(buffer) ships the actual bytes
   → browser receives everything, sees "attachment" instruction, triggers Save dialog
   → file lands in Downloads folder with the correct name and content


What the purpose of webhook and why it exists?
   POST /payments/verify → Fast UI update after payment.
   POST /payments/webhook → Guaranteed fulfillment if the frontend never reaches your backend.

Bcz both do the same work but scenarion is reuqest never get verified thats where webhook arrive it gurantees Fulfillment
even after user close browser internet disconnetion happens



This is how almost every production payment system works
                 User
                   │
                   ▼
          Razorpay Checkout
                   │
                   ▼
            Payment Success
              /          \
             /            \
            ▼              ▼
Frontend Verify      Razorpay Webhook
            \              /
             \            /
              ▼          ▼
             fulfillPayment()
                    │
        Update Payment if status=CREATED
                    │
             Grant Credits Once