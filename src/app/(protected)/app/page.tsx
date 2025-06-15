"use client";
import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Share2, CheckCircle, DollarSign, User, Building2, Zap, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import '@/app/button-styles.css';
import { generatePaymentCode, validatePaymentCode } from './(actions)/payment-code';
import { useRouter } from 'next/navigation';



interface GeneratedPayment {
  code: string;
  amount: number;
  fees: number;
  total: number;
  createdAt: string;
  expiresAt: string;
}

interface ProcessPaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

interface PaymentCodeInputProps {
  onCodeSubmit: (code: string) => void;
  isLoading: boolean;
}

interface GeneratePaymentFormProps {
  onGenerate: (amount: number) => void;
  isLoading: boolean;
  generatedPayment: GeneratedPayment | null;
}




const PaymentCodeInput: React.FC<PaymentCodeInputProps> = ({ onCodeSubmit, isLoading }) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handleCodeChange = (index: number, value: string, isPaste: boolean = false): void => {
    const newCode = [...code];
    
    if (isPaste) {
      // Handle pasted content - take first 5 characters and distribute to inputs
      const pastedCode = value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Remove non-alphanumeric chars
      const maxLength = Math.min(pastedCode.length, 5); // Only take up to 5 characters
      
      for (let i = 0; i < maxLength; i++) {
        if (i + index < 5) { // Ensure we don't go out of bounds
          newCode[i + index] = pastedCode[i];
        }
      }
      
      // Focus the last input that was filled
      const lastFilledIndex = Math.min(index + maxLength - 1, 4);
      const lastInput = document.getElementById(`code-${lastFilledIndex}`);
      lastInput?.focus();
    } else {
      // Handle single character input
      if (value.length > 1) return;
      newCode[index] = value.toUpperCase();
      
      // Auto-focus next input for single character input
      if (value && index < 4) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
    
    setCode(newCode);
    
    // Check if complete
    const complete = newCode.every(digit => digit !== '');
    setIsComplete(complete);
    
    if (complete) {
      onCodeSubmit(newCode.join(''));
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    console.log({pastedText})
    if (pastedText) {
      handleCodeChange(index, pastedText, true);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Enter Payment Code
        </h2>
        <p className="text-muted-foreground">Enter the 5-digit payment code</p>
      </div>
      
      <div className="flex justify-center gap-3">
        {code.map((digit, index) => (
          <Input
            key={index}
            id={`code-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value, false)}
            onPaste={(e) => handlePaste(e, index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-bold border-2 bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 transition-all duration-200 hover:border-blue-400"
            maxLength={1}
            disabled={isLoading}
          />
        ))}
      </div>
      
      {isLoading && (
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
          <p className="text-sm text-muted-foreground mt-2">Validating code...</p>
        </div>
      )}
      
      <Alert className="border-blue-200 bg-blue-50">
        <Zap className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Try entering <code className="px-1 py-0.5 bg-blue-100 rounded font-mono">DEMO1</code> to see the demo flow
        </AlertDescription>
      </Alert>
    </div>
  );
};

const GeneratePaymentForm: React.FC<GeneratePaymentFormProps> = ({ onGenerate, isLoading, generatedPayment }) => {
  const [amount, setAmount] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (amount && parseFloat(amount) > 0) {
      onGenerate(parseFloat(amount));
    }
  };

  const fees = amount ? parseFloat(amount) * 0.05 : 0;
  const total = amount ? parseFloat(amount) + fees : 0;

  if (generatedPayment) {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="text-center space-y-4">
          <div className="animate-in zoom-in-50 duration-700 delay-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-green-600">Payment Code Generated!</h2>
          
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-4xl font-mono font-bold text-green-700 tracking-wider">
                  {generatedPayment.code}
                </div>
                <div className="text-sm text-green-600">
                  Expires in 24 hours
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="btn btn-lg btn-primary w-full" style={{ minWidth: '120px' }}
              onClick={() => window.location.href = `/app/pay/${generatedPayment.code}`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
            <Button 
              variant="outline" 
              className="btn btn-lg btn-outline w-full"
              onClick={() => {
                navigator.clipboard.writeText(generatedPayment.code);
                toast.success('Payment code copied to clipboard!');
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Generate Payment
        </h2>
        <p className="text-muted-foreground">Create a new payment request</p>
      </div>
      
      {!showForm ? (
        <Button 
          onClick={() => setShowForm(true)}
          className="btn btn-lg btn-secondary w-full transform hover:scale-105 transition-transform duration-200"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Create Payment Request
        </Button>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Amount (USD)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg h-12"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && amount && parseFloat(amount) > 0) {
                    handleSubmit();
                  }
                }}
              />
            </div>
            
            {amount && (
              <Card className="border-purple-200 bg-purple-50 animate-in fade-in duration-300">
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Fees (5%):</span>
                      <span className="font-medium">${fees.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-purple-700">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Button 
              onClick={handleSubmit}
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              className="btn btn-lg btn-primary w-full disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Payment Code'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};



const ZellePayInterface: React.FC = () => {
  type View = 'main' | 'payment';
  const router = useRouter()
  const [currentView, setCurrentView] = useState<View>('payment');
  const [paymentCode, setPaymentCode] = useState<string>('');
  const [generatedPayment, setGeneratedPayment] = useState<GeneratedPayment | null>(null);
  const queryClient = useQueryClient();

  // Mock React Query for payment code validation
  const validateCodeMutation = useMutation<{success:boolean,code:string}, Error, string>({
    mutationFn: async (code: string) => {
      const response = await validatePaymentCode(code);
      if(response.error){
        toast.error(JSON.stringify(response.error))
        throw new Error(response.error)
      } 
      return {
        success:response.success,
        code:code
      }
       
    },
    onSuccess: async (data) => {
      if (data) {
        if(data.success){
          setCurrentView('payment');
          router.push(`/app/pay/${data.code}`)
        }
      }
    }
  });

  // Mock React Query for payment generation
  const generatePaymentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const data = await generatePaymentCode(amount)
      console.log({data})
      if(!data.success && data.error){
        toast.error(JSON.stringify(data.error))
        console.log(data.error)
        throw new Error('Payment code not found')
      }
      if(!data.data){
        toast.error("Payment code not found")
        throw new Error("Payment code not found")
      }
      return data.data
    },
    onSuccess: (data) => {
      
      setGeneratedPayment({
        amount: data.amount,
        code: data.id,
        fees: data.amount * 0.05,
        total: data.amount + (data.amount * 0.05),
        createdAt: data.created_at,
        expiresAt: data.created_at + 12 * 60 * 60 * 1000
      });
    }
  });



  const handleCodeSubmit = (code: string): void => {
    validateCodeMutation.mutate(code);
  };

  const handleGeneratePayment = (amount: number): void => {
    generatePaymentMutation.mutate(amount);
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 p-4">
      <div className="max-w-md mx-auto pt-8 space-y-6">
        {/* Enter Payment Code Section */}
        <Card className="backdrop-blur-xl bg-white/90 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <PaymentCodeInput
              onCodeSubmit={handleCodeSubmit}
              isLoading={validateCodeMutation.isPending}
            />
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-sm font-medium">OR</span>
          <Separator className="flex-1" />
        </div>

        {/* Generate Payment Section */}
        <Card className="backdrop-blur-xl bg-white/70 border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <GeneratePaymentForm
              onGenerate={handleGeneratePayment}
              isLoading={generatePaymentMutation.isPending}
              generatedPayment={generatedPayment}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZellePayInterface;