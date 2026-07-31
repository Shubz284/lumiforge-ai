import crypto from "crypto";

interface VerifyPaymentSignatureParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: VerifyPaymentSignatureParams) {
  const body = `${orderId}|${paymentId}`

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

     console.log("Order ID:", orderId);
     console.log("Payment ID:", paymentId);
     console.log("Received Signature:", signature);
     console.log("Expected Signature:", expectedSignature);
     console.log("Secret exists:", !!process.env.RAZORPAY_KEY_SECRET);

  return timingSafeEqual(expectedSignature, signature);
}

export function verifyWebhookSignature(rawBody:string,  signature:string):boolean{
    if(!process.env.RAZORPAY_WEBHOOK_SECRET) return false;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");
    return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);

  if (ab.length !== bb.length) {
    return false;
  }

  return crypto.timingSafeEqual(ab, bb);
}