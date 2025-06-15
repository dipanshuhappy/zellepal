"use server";
import { createClient } from "@/server/supabase";
import { customAlphabet } from 'nanoid';
import { auth } from "@/auth";
import { normieTechClient } from "@/lib/normie-tech";
import {addHours} from "date-fns"
// Create a nanoid generator for 5-character alphanumeric lowercase codes
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5);
type PaymentStatus = "pending"|"completed"|"failed";
function deduceStatus(status:string):PaymentStatus{
    switch(status){
        case "not-started-by-sender":
            return "pending"
        case "wait-for-payment-details":
            return "pending"
        case "payment-confirmed-by-sender":
            return "completed"
        case "payment-confirmed-by-admin":
            return "completed"
        case "confirmed-but-settle-later":
            return "pending"
        case "failed":
            return "failed"
        default:
            return "failed"
    }
}
export async function validatePaymentCode(code: string) {
    const session = await auth()
    if(!session){
        return {
            success:false,
            error:"Unauthorized",
            data:null
        }
    }
    const supabase = await createClient();
    const { data, error } = await supabase
    .from("payment_codes")
    .select()
    .eq("id",code)
    .single();
    console.log({data,error})
    if(error){
        return {
            success:false,
            error:error.message,
            data:null
        }
    }
    if(!data.externalTransactionId){
        console.log("Payment code not found")
        return {
            success:false,
            error:"Payment code not found",
            data:null
        }
    }
        
    // const updateZelle = await normieTechClient.POST(`/v1/payment/6/zelle-mail/zelle-details`,{
    //     params:{
    //         header:{
    //             "x-api-key":process.env.NORMIE_API!
    //         }
    //     },
    //     body:{
    //         transactionId:data.externalTransactionId,
    //     }
    // })
    // if(updateZelle.error){
    //     return {
    //         success:false,
    //         error:JSON.stringify(updateZelle.error),
    //         data:null
    //     }
    // }
    return {
        success:true,
        error:null,
        data:null
    }

}
type Recipient = {
    name: string;
    zelleId: string;
    isBusiness: boolean;
};
  
type Payment = {
    id: string;
    code: string;
    amount: number;
    fees: number;
    total: number;
    recipient: Recipient;
    status: 'pending' | 'completed' | 'failed';
    expiresAt: string;
};
export async function getPaymentDetails(code:string){
    const session = await auth();
    if(!session){
        return {
            success:false,
            error:"Unauthorized",
            data:null
        }
    }   
    const supabase = await createClient();
    const { data, error } = await supabase
    .from("payment_codes")
    .select()
    .eq("id",code)
    .single();
    console.log({data,error})
    if(error){
        return {
            success:false,
            error:error.message,
            data:null
        }
    }
    if(!data){
        console.log("Payment code not found")
        return {
            success:false,
            error:"Payment code not found",
            data:null
        }
    }
    if(!data.externalTransactionId){
        console.log("Payment code not found")
        return {
            success:false,
            error:"Payment code not found",
            data:null
        }
    }
    const zelleDetails = await normieTechClient.GET(`/v1/payment/5/details/{transactionId}`,{
        params:{
            header:{
                "x-api-key":process.env.NORMIE_API!
            },
            path:{
                transactionId:data.externalTransactionId
            }
        }
    })
    const zelleDetailsData = zelleDetails.data;
    if(zelleDetails.error){
        return {
            success:false,
            error:zelleDetails.error,
            data:null
        }
    }
    if(!zelleDetailsData){
        return {
            success:false,
            error:"Zelle details not found",
            data:null
        }
    }
    const lpDetails = await normieTechClient.GET('/v1/payment/6/zelle-mail/lp/{zelleId}',{
        params:{
            path:{
                zelleId:zelleDetailsData.data.payoutDetails!
            }
        }
    })
    const lpDetailsData = lpDetails.data;
    if(lpDetails.error){
        return {
            success:false,
            error:lpDetails.error,
            data:null
        }
    }
    if(!lpDetailsData){
        return {
            success:false,
            error:"LP details not found",
            data:null
        }
    }
    const fees = ((zelleDetailsData.data.amount! - zelleDetailsData.data.uniquenessAmount!) * 0.95);
    const total = zelleDetailsData.data.amount!;
    
    return {
        success:true,
        error:null,
        data:{
           amount:zelleDetailsData.data.amount!,
           fees: fees,
           total:total,
           recipient:{
            name:lpDetailsData.data.zelleName!,
            zelleId:lpDetailsData.data.zelleId!,
            isBusiness:lpDetailsData.data.isBusinessZelle!
           },
           status:deduceStatus(zelleDetailsData.data.confirmationStatus!),
           expiresAt:addHours(new Date(zelleDetailsData.data.createdAt!),12).toISOString()
        } as Payment
    }
}

export async function captureZellePayment(code: string) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const supabase = await createClient();
  
  try {
    // Get the payment code details
    const { data: codeData, error: codeError } = await supabase
      .from("payment_codes")
      .select()
      .eq("id", code)
      .single();

    if (codeError || !codeData?.externalTransactionId) {
      return { success: false, message: "Invalid payment code" };
    }

    const transactionId = codeData.externalTransactionId;

    // Confirm the payment
    const confirmResponse = await normieTechClient.POST('/v1/payment/6/zelle-mail/confirm', {
      params: {
        header: {
          "x-api-key": process.env.NORMIE_API!
        }
      },
      body: {
        transactionId: transactionId,
      }
    });

    if (confirmResponse.response.status !== 200) {
      return { 
        success: false, 
        message: `Payment confirmation failed: ${confirmResponse.response.statusText}` 
      };
    }

    // If confirmation is successful, settle the payment
    if (confirmResponse.data) {
      const settleResponse = await normieTechClient.POST('/v1/payment/6/zelle-mail/settle', {
        params: {
          header: {
            "x-api-key": process.env.NORMIE_API!
          }
        },
        body: {
          transactionId: transactionId,
        }
      });

      if (settleResponse.response.status === 200) {
        // Update the payment code with the settlement detailsxexe
        return { 
          success: true, 
          message: "Payment confirmed and settled successfully",
          transactionId: transactionId
        };
      } else {
        return { 
          success: false, 
          message: `Payment settlement failed: ${settleResponse.response.statusText}`
        };
      }
    }

    return { 
      success: false, 
      message: "Payment verification failed: No confirmation data received" 
    };
  } catch (error) {
    console.error("Failed to capture Zelle payment:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

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
  const generateOrderResponse = await normieTechClient.POST("/v1/payment/6/zelle-mail/zelle-details",{
    params:{
        header:{
            "x-api-key":process.env.NORMIE_API!
        }
    },
    body:{
        transactionId:checkoutData.transactionId
    }
  })
  if(generateOrderResponse.error){
    return {
        success:false,
        error:generateOrderResponse.error,
        data:null
    }
  }
  if(!generateOrderResponse.data){
    return {
        success:false,
        error:"Order data not found",
        data:null
    }
  }
  const zelleDetails = await normieTechClient.GET(`/v1/payment/5/details/{transactionId}`,{
    params:{
        header:{
            "x-api-key":process.env.NORMIE_API!
        },
        path:{
            transactionId:checkoutData.transactionId
        }
    }
  })
  const zelleDetailsData = zelleDetails.data;
  if(zelleDetails.error){
    return {
        success:false,
        error:zelleDetails.error,
        data:null
    }
  }
  if(!zelleDetailsData){
    return {
        success:false,
        error:"Zelle details not found",
        data:null
    }
  }
  if(!zelleDetails.data){
    return {
        success:false,
        error:"Zelle details not found",
        data:null
    }
  }
  const paymentCode = {
    id: nanoid(),
    amount: Number(zelleDetailsData.data.amount?.toFixed(2)),
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
        error:error.message,
        data:null
    }
  }
  if(!data){
    return {
        success:false,
        error:"Payment code not found",
        data:null
    }
  }

  return {
    success:true,
    error:null,
    data:data
  }
}
