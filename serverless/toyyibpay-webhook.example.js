/**
 * ToyyibPay webhook example only.
 * Production should verify billCode/status using ToyyibPay API before activating premium.
 */
export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const billCode = formData.get('billcode') || formData.get('billCode');
  const status = formData.get('status_id') || formData.get('status');

  // TODO: Verify payment with ToyyibPay API.
  // TODO: Find payments.toyyibpay_bill_code = billCode.
  // TODO: If paid, update payments.status='paid'.
  // TODO: Update profiles.subscription_type='lifetime', max_children according to purchased package.
  // TODO: Create notification + user_notifications for parent inbox.

  return Response.json({ ok: true, billCode, status });
}
