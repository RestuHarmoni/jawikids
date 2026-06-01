/**
 * Example serverless endpoint only.
 * Deploy as Cloudflare Worker / Pages Function / Supabase Edge Function.
 * Do not expose TOYYIBPAY_SECRET_KEY in frontend.
 */
export async function onRequestPost(context) {
  const body = await context.request.json();
  const { productType, extraSlots = 0, userId } = body;

  const baseAmount = 49.90;
  const slotAmount = Math.min(Math.max(Number(extraSlots), 0), 2) * 10;
  const amount = productType === 'child_slot' ? slotAmount : baseAmount + slotAmount;
  const maxChildren = 3 + Math.min(Math.max(Number(extraSlots), 0), 2);

  // TODO: Call ToyyibPay createBill API here.
  // TODO: Insert payment row into Supabase payments table with pending status.

  return Response.json({
    ok: true,
    demo: true,
    bill_url: 'https://toyyibpay.com/demo-bill-url',
    amount,
    max_children: maxChildren,
    user_id: userId,
  });
}
