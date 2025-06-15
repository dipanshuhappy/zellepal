"use server";
import { createClient } from "@/server/supabase";
import { randomUUID } from "crypto";
import { auth } from "@/auth";

export async function generatePaymentCode(amount: number) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const payoutAddress = session.user.id;
  const supabase = await createClient();
  if (!payoutAddress) {
    throw new Error("Unauthorized");
  }

  const paymentCode = {
    id: randomUUID(),
    amount: amount,
    payout_address: payoutAddress,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("payment_codes")
    .insert(paymentCode)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
