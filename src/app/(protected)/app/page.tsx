"use client";
import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Share2, CheckCircle, DollarSign, User, Building2, Zap } from 'lucide-react';
import '@/app/button-styles.css';
import { generatePaymentCode } from './(actions)/payment-code';

// Type definitions
interface PaymentData {
  id: string;
  amount: number;
  recipient: string;
  zelleId: string;
  isBusiness: boolean;
  fees: number;
  total: number;
}

interface GeneratedPayment {
  code: string;
  amount: number;
  fees: number;
  total: number;
  createdAt: string;
  expiresAt: string;
}

interface ValidatePaymentResponse {
  valid: boolean;
  payment?: PaymentData;
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

interface PaymentConfirmationProps {
  paymentData: PaymentData;
  onConfirm: () => void;
  isLoading: boolean;
}

// Mock API functions with TypeScript types
const mockAPI = {
  validatePaymentCode: async (code: string): Promise<ValidatePaymentResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (code === 'DEMO1') {
      return {
        valid: true,
        payment: {
          id: 'pay_123',
          amount: 250.00,
          recipient: 'Alice Johnson',
          zelleId: 'alice.johnson@email.com',
          isBusiness: false,
          fees: 12.50,
          total: 262.50
        }
      };
    }
    return { valid: false };
  },
  
  generatePayment: async (amount: number): Promise<GeneratedPayment> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const fees = amount * 0.05;
    return {
      code,
      amount,
      fees,
      total: amount + fees,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },
  
  processPayment: async (code: string): Promise<ProcessPaymentResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      transactionId: 'txn_' + Math.random().toString(36).substring(2, 10),
      message: 'Payment initiated successfully!'
    };
  }
};

const PaymentCodeInput: React.FC<PaymentCodeInputProps> = ({ onCodeSubmit, isLoading }) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handleCodeChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
    
    // Check if complete
    const complete = newCode.every(digit => digit !== '');
    setIsComplete(complete);
    
    if (complete) {
      onCodeSubmit(newCode.join(''));
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
            onChange={(e) => handleCodeChange(index, e.target.value)}
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
              onClick={() => window.location.href = `/pay/${generatedPayment.code}`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
            <Button variant="outline" className="btn btn-lg btn-outline w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Code
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

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ paymentData, onConfirm, isLoading }) => {
  type Step = 'start' | 'details' | 'confirm';
  const [step, setStep] = useState<Step>('start');

  const handleStartPayment = (): void => {
    setStep('details');
  };

  const handleConfirmPayment = () => {
    onConfirm();
  };

  if (step === 'start') {
    return (
      <div className="space-y-6 text-center animate-in fade-in-50 duration-500">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payment Ready</h1>
          <p className="text-muted-foreground">Ready to process your payment</p>
        </div>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-700">
                ${paymentData.amount.toFixed(2)}
              </div>
              <div className="text-sm text-blue-600">
                + ${paymentData.fees.toFixed(2)} fees
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={handleStartPayment}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 text-white font-semibold shadow-lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          Start Payment
        </Button>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
          <p className="text-muted-foreground">Please review the payment information</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Recipient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{paymentData.recipient}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Zelle ID:</span>
              <span className="font-mono text-sm">{paymentData.zelleId}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Account Type:</span>
              <Badge variant={paymentData.isBusiness ? "default" : "secondary"}>
                {paymentData.isBusiness ? (
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
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${paymentData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Fees:</span>
                <span>${paymentData.fees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${paymentData.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={handleConfirmPayment}
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold shadow-lg disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'CONFIRM PAYMENT'
          )}
        </Button>
      </div>
    );
  }
};

const ZellePayInterface: React.FC = () => {
  type View = 'main' | 'payment';
  const [currentView, setCurrentView] = useState<View>('payment');
  const [paymentCode, setPaymentCode] = useState<string>('');
  const [generatedPayment, setGeneratedPayment] = useState<GeneratedPayment | null>(null);
  const queryClient = useQueryClient();

  // Mock React Query for payment code validation
  const validateCodeMutation = useMutation<ValidatePaymentResponse, Error, string>({
    mutationFn: (code: string) => mockAPI.validatePaymentCode(code),
    onSuccess: (data) => {
      if (data.valid && data.payment) {
        setPaymentCode(data.payment.id);
        setCurrentView('payment');
        // Simulate navigation to /pay/<code>
        window.history.pushState({}, '', `/pay/${data.payment.id}`);
      }
    }
  });

  // Mock React Query for payment generation
  const generatePaymentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const data = await generatePaymentCode(amount)
      return data
    },
    onSuccess: (data) => {
      setGeneratedPayment(data);
    }
  });

  // Mock React Query for payment processing
  const processPaymentMutation = useMutation<ProcessPaymentResponse, Error, string>({
    mutationFn: (code: string) => mockAPI.processPayment(code),
    onSuccess: (data) => {
      alert(`Payment successful! Transaction ID: ${data.transactionId}`);
    }
  });

  const handleCodeSubmit = (code: string): void => {
    validateCodeMutation.mutate(code);
  };

  const handleGeneratePayment = (amount: number): void => {
    generatePaymentMutation.mutate(amount);
  };

  const handleConfirmPayment = () => {
    processPaymentMutation.mutate(paymentCode);
  };

  if (currentView === 'payment' && validateCodeMutation.data?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card className="backdrop-blur-xl bg-white/70 border-white/30 shadow-2xl">
            <CardContent className="p-6">
              <PaymentConfirmation
                paymentData={validateCodeMutation.data.payment}
                onConfirm={handleConfirmPayment}
                isLoading={processPaymentMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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