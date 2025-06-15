"use server";
import { createClient } from "@/server/supabase";
import { customAlphabet } from 'nanoid';
import { auth } from "@/auth";
import { normieTechClient } from "@/lib/normie-tech";

// Create a nanoid generator for 5-character alphanumeric lowercase codes
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5);

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

 

  const checkoutResponse = await normieTechClient.POST("/v1/{projectId}/0/checkout",{
    params:{
        path:{
            
            projectId:"zelle-pal"
        },
        header:{
            "x-api-key":process.env.NORMIE_API!
        }
    },
    body:{
        amount:Number(amount) * 100,
        metadata:{
          payoutAddress:payoutAddress,
        },
        name:"Payment Code",
        success_url:"",
        forwardFeesToUsersInCheckout:true
    }
  })
 
  if(checkoutResponse.error){
    return {
        success:false,
        error:checkoutResponse.error,
        data:null
    }
  }
  const checkoutData = checkoutResponse.data;
  if(!checkoutData){
    return {
        success:false,
        error:"Checkout data not found",
        data:null
    }
  }
  const paymentCode = {
    id: nanoid(),
    amount: Number(amount.toFixed(2)),
    payout_address: payoutAddress,
    created_at: new Date().toISOString(),
    externalTransactionId:checkoutData.transactionId
  };

  const { data, error } = await supabase
    .from("payment_codes")
    .insert(paymentCode)
    .select()
    .single();

  if (error) {
    return {
        success:false,
        error:error,
        data:null
    }
  }

  return {
    success:true,
    error:null,
    data:data
  }
}
