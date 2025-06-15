"use client";
import React, { useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  CreditCard, 
  User, 
  Building2, 
  AlertTriangle, 
  Mail, 
  Sparkles,
  CheckCircle,
  Clock,
  Shield,
  LucideIcon
} from 'lucide-react';
import { getPaymentDetails, captureZellePayment } from '../../(actions)/payment-code';
import { toast } from 'sonner';

// Types

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
type PaymentResponse = {
  success: boolean;
  transactionId: string;
  message: string;
  estimatedTime: string;
};

interface SparkleEffectProps {
  isActive: boolean;
  children: ReactNode;
}

interface PaymentSummaryCardProps {
  payment: Payment;
  onPayNow: () => void;
  isLoading: boolean;
}

interface PaymentDetailsProps {
  payment: Payment;
  onConfirmPayment: () => void;
  isLoading: boolean;
  isVisible: boolean;
}



const SparkleEffect: React.FC<SparkleEffectProps> = ({ isActive, children }) => {
  return (
    <div className="relative">
      {children}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Sparkle particles */}
          <div className="sparkle sparkle-1"></div>
          <div className="sparkle sparkle-2"></div>
          <div className="sparkle sparkle-3"></div>
          <div className="sparkle sparkle-4"></div>
          <div className="sparkle sparkle-5"></div>
          <div className="sparkle sparkle-6"></div>
        </div>
      )}
    </div>
  );
};

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ payment, onPayNow, isLoading }) => {
  const expirationDate = new Date(payment.expiresAt);
  const now = new Date();
  
  // Ensure dates are valid before arithmetic
  if (isNaN(expirationDate.getTime())) {
    console.error('Invalid expiration date:', payment.expiresAt);
    return null;
  }
  
  const timeLeft = expirationDate.getTime() - now.getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mx-2 sm:mx-0">
      <CardHeader className="text-center pb-3 px-4 pt-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          Payment Request
        </CardTitle>
        <Badge variant="outline" className="mx-auto w-fit text-xs sm:text-sm">
          Code: {payment.code}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 pb-6">
        {/* Amount Display */}
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-bold text-blue-700">
            ${payment.amount.toFixed(2)}
          </div>
          <div className="text-xs sm:text-sm text-orange-600">
            + ${payment.fees.toFixed(2)} fees
          </div>
          <div className="text-base sm:text-lg font-semibold text-gray-800">
            Total: ${payment.total.toFixed(2)}
          </div>
        </div>

        {/* Recipient Info */}
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 space-y-2">
          <div className="flex items-center gap-2">
            {payment.recipient.isBusiness ? (
              <>
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Business Payment</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Personal Payment</span>
              </>
            )}
          </div>
          
          <div>
            <div className="text-xs sm:text-sm text-gray-600">Recipient</div>
            <div className="font-semibold text-base sm:text-lg leading-tight">{payment.recipient.name}</div>
          </div>
        </div>

        {/* Expiry Warning */}
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
          <AlertDescription className="text-orange-700 text-sm">
            Expires in {hoursLeft}h {minutesLeft}m
          </AlertDescription>
        </Alert>

        {/* Pay Button */}
        <Button 
          onClick={onPayNow}
          disabled={isLoading}
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700  font-bold text-base sm:text-lg shadow-lg transform active:scale-95 transition-all duration-200 touch-manipulation"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              Preparing Payment...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              PAY NOW
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onConfirmPayment, isLoading, isVisible }) => {
  if (!isVisible) return null;

  return (
    <SparkleEffect isActive={isVisible}>
      <Card className="bg-white border-gray-200 shadow-lg animate-in slide-in-from-bottom-4 duration-700 mx-2 sm:mx-0">
        <CardHeader className="px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-green-700">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            Zelle Payment Details
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 px-4 pb-6">
          {/* Critical Warning */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <AlertDescription className="text-red-700 font-medium text-sm leading-relaxed">
              <strong>IMPORTANT:</strong> Send exactly <span className="font-bold">${payment.amount.toFixed(2)}</span> to the Zelle ID below. 
              Do NOT include fees in your Zelle transfer.
            </AlertDescription>
          </Alert>

          {/* Payment Information */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium text-sm sm:text-base">Amount to Send:</span>
                <span className="text-xl sm:text-2xl font-bold text-green-600">${payment.amount.toFixed(2)}</span>
              </div>
              
              <Separator className="bg-gray-200" />
              
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-600 text-sm sm:text-base">Zelle ID:</span>
                  <span className="font-mono text-xs sm:text-sm bg-blue-100 px-2 py-1 rounded break-all">
                    {payment.recipient.zelleId}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-600 text-sm sm:text-base">Recipient Name:</span>
                  <span className="font-semibold text-sm sm:text-base">{payment.recipient.name}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 items-start sm:items-center">
                  <span className="text-gray-600 text-sm sm:text-base">Account Type:</span>
                  <Badge variant={payment.recipient.isBusiness ? "default" : "secondary"} className="w-fit">
                    {payment.recipient.isBusiness ? (
                      <>
                        <Building2 className="w-3 h-3 mr-1" />
                        Business
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        Personal
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <AlertDescription className="text-blue-700 text-sm leading-relaxed">
                <strong>Instructions:</strong> Open your Zelle app, send <strong>${payment.amount.toFixed(2)}</strong> to{' '}
                <strong className="break-all">{payment.recipient.zelleId}</strong>, then confirm below.
              </AlertDescription>
            </Alert>

            {/* Confirm Button */}
            <div>
              <Button 
                onClick={onConfirmPayment}
                disabled={isLoading}
                className="btn btn-lg btn-primary w-full disabled:bg-gray-300 disabled:text-gray-500"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </SparkleEffect>
  );
};

export default function  PaymentPage({
  params,
}: {
  params: { code: string }
}) {
  if(!params.code){
    return <div>Payment code not found</div>
  }
  // Get payment code from URL params
  const [paymentCode] = useState<string>(params.code);
  const [sparkleActive, setSparkleActive] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const showDetails = true; // Always show payment details directly

  // Fetch payment details
  const { data: payment, isLoading, error } = useQuery({
    queryKey: ['payment', paymentCode],
    queryFn: async () => {
      const paymentDetails =  await getPaymentDetails(paymentCode)
      console.log({paymentDetails})
      if(!paymentDetails.success){
        toast.error(JSON.stringify(paymentDetails.error))
        throw new Error("Payment details not found")
      }
      if(!paymentDetails.data){
        toast.error("Payment details not found")
        throw new Error("Payment details not found")
      }
      return paymentDetails.data
    }, 
    refetchInterval:5000,
    refetchOnWindowFocus:true
    
  });

  // Payment confirmation mutation
  const paymentMutation = useMutation({
    mutationFn: async () => {
      if (!payment) {
        throw new Error('Payment details not available');
      }
      const result = await captureZellePayment(payment.code);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      toast.success('Payment confirmed successfully!', {
        description: data.message,
        duration: 5000,
      });
      // Refresh the payment details
      queryClient.invalidateQueries({ queryKey: ['payment', paymentCode] });
    },
    onError: (error) => {
      toast.error('Payment confirmation failed', {
        description: error.message,
        duration: 5000,
      });
    }
  });

  const handleConfirmPayment = () => {
    paymentMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 flex items-center justify-center px-4 py-6">
        <Card className="bg-white/90 border-gray-200 shadow-lg w-full max-w-sm">
          <CardContent className="p-6 text-center">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto text-blue-500 mb-3" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Loading Payment Details</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Please wait while we retrieve your payment information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 flex items-center justify-center px-4 py-6">
        <Card className="bg-white/90 border-red-200 shadow-lg w-full max-w-sm">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-red-700">Payment Not Found</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              The payment code "{paymentCode}" could not be found or has expired.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-gray-300 hover:bg-gray-50 w-full h-10 text-sm sm:text-base touch-manipulation"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4 py-6 safe-area-inset">
      <div className="max-w-sm mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-1 px-2">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            ZellePal Payment
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Secure and instant payment processing</p>
        </div>

        {/* Payment Details */}
        <SparkleEffect isActive={sparkleActive}>
        {payment && (
          <PaymentDetails
            payment={payment}
            onConfirmPayment={handleConfirmPayment}
            isLoading={paymentMutation.isPending}
            isVisible={true}
          />
        )}
        </SparkleEffect>

        {/* Footer */}
        <div className="text-center pt-2 pb-4 px-2">
          <p className="text-xs text-gray-500 leading-relaxed">
            Powered by ZellePal • Secure • Instant • Reliable
          </p>
        </div>
      </div>

      {/* Sparkle Animation Styles */}
      <style jsx>{`
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #3b82f6, #10b981);
          border-radius: 50%;
          animation: sparkle 1.5s ease-in-out infinite;
          box-shadow: 0 0 4px rgba(59, 130, 246, 0.8);
        }
        
        @media (min-width: 640px) {
          .sparkle {
            width: 6px;
            height: 6px;
            box-shadow: 0 0 6px rgba(59, 130, 246, 0.8);
          }
        }
        
        .sparkle-1 {
          top: 15%;
          left: 15%;
          animation-delay: 0s;
        }
        
        .sparkle-2 {
          top: 25%;
          right: 20%;
          animation-delay: 0.2s;
        }
        
        .sparkle-3 {
          bottom: 35%;
          left: 25%;
          animation-delay: 0.4s;
        }
        
        .sparkle-4 {
          top: 55%;
          right: 15%;
          animation-delay: 0.6s;
        }
        
        .sparkle-5 {
          bottom: 15%;
          left: 35%;
          animation-delay: 0.8s;
        }
        
        .sparkle-6 {
          top: 35%;
          left: 55%;
          animation-delay: 1s;
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        
        @keyframes slide-in-from-bottom-4 {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-in {
          animation-duration: 0.5s;
          animation-fill-mode: both;
        }
        
        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom-4;
        }
        
        .duration-700 {
          animation-duration: 0.7s;
        }
        
        /* Mobile-specific optimizations */
        .touch-manipulation {
          touch-action: manipulation;
        }
        
        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
        
        /* Prevent zoom on inputs on iOS */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        
        /* Better touch targets */
        button, .button {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Smooth scrolling for mobile */
        html {
          scroll-behavior: smooth; 
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};
