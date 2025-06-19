"use client"
import { useState } from "react";
import { Navigation } from "./Navigation";
import { UserInfo } from "./UserInfo";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useSession } from "next-auth/react";
import { Marble, Button as WorldButton, NumberPad } from '@worldcoin/mini-apps-ui-kit-react';
import { Button } from './ui/button';
import { useBalance } from "wagmi";
import { CONSTANTS } from "@/lib/constants"
import { formatUnits } from "viem";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { RefreshCcw, Copy, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema for amount validation
const amountSchema = z.object({
  amount: z
    .number()
    .min(1, "Amount must be at least $1")
    .max(10, "Amount cannot exceed $10")
    .int("Amount must be a whole number")
});

type AmountFormData = z.infer<typeof amountSchema>;

// Mock API functions
const generatePaymentDetails = async (amount: number) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  return {
    amount: amount.toString(),
    zelleId: 'zelle@example.com',
    recipientName: 'John Doe',
    transactionId: `tx_${Date.now()}`
  };
};

function WalletTab({ amount, setAmount, copyToClipboard, copyStatus }: {
  amount: string;
  setAmount: (value: string) => void;
  copyToClipboard: (text: string, field: string, message: string) => void;
  copyStatus: { field: string; status: boolean };
}) {
  const [step, setStep] = useState<'input' | 'payment-details'>('input');
  
  const form = useForm<AmountFormData>({
    resolver: zodResolver(amountSchema),
    defaultValues: {
      amount: 0
    }
  });

  const { control, watch, setValue, handleSubmit, formState: { errors, isValid } } = form;
  const currentAmount = watch('amount');
  
  const generatePaymentMutation = useMutation({
    mutationFn: generatePaymentDetails,
    onSuccess: () => {
      setStep('payment-details');
    },
    onError: () => {
      toast.error('Failed to generate payment details');
    }
  });

  const handleNumberPadValue = (value: string) => {
    console.log({value})
    if (value === 'clear' || value === "") {
      setValue('amount', 0, { shouldValidate: true });
    } else if (value === 'backspace') {
      const currentStr = currentAmount.toString();
      const newValue = currentStr.length > 1 ? 
        parseInt(currentStr.slice(0, -1)) : 0;
      setValue('amount', newValue, { shouldValidate: true });
    } else if (value === '.') {
      // Ignore decimal points since we only want integers
      return;
    } else {
      const currentStr = currentAmount.toString();
      console.log({currentStr})
      const newStr = currentAmount === 0 ? value : `${currentStr}${value}`;
      const newValue = parseInt(newStr);

      
     
        setValue('amount', newValue, { shouldValidate: true });
      
    }
  };

  const onSubmit = (data: AmountFormData) => {
    generatePaymentMutation.mutate(data.amount);
  };

  const handleBack = () => {
    setStep('input');
    generatePaymentMutation.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full pt-4 pb-4"
    >
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Send Money</h2>
              <p className="text-sm text-gray-600">Enter amount to transfer (max $10)</p>
            </div>

            {/* Amount Display */}
            <div className="text-center mb-4">
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${field.value}
                  </div>
                )}
              />
              <div className="text-sm text-gray-500">USD (integers only)</div>
            </div>

            {/* Error Message */}
            {errors.amount && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4"
              >
                <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg inline-block">
                  {errors.amount.message}
                </div>
              </motion.div>
            )}

            {/* NumberPad */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="mb-6">
                <NumberPad
                  onChange={handleNumberPadValue}
                />
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || currentAmount === 0 || generatePaymentMutation.isPending}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatePaymentMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'payment-details' && generatePaymentMutation.data && (
          <motion.div
            key="payment-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {/* Header with Back Button */}
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2 -ml-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1 text-center">
                <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
              </div>
              <div className="w-9" /> {/* Spacer for center alignment */}
            </div>

            {/* Payment Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 mb-6 text-center"
            >
              <div className="text-white/80 text-sm font-medium mb-1">Amount to Send</div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-bold text-white">
                  ${generatePaymentMutation.data.amount}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatePaymentMutation.data.amount, 'amount', 'Amount copied!')}
                  className="bg-white/20 hover:bg-white/30 text-white h-8 w-8 p-0 rounded-lg"
                >
                  {copyStatus.field === 'amount' && copyStatus.status ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-8"
            >
              {/* Zelle ID */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Zelle ID</div>
                    <div className="font-mono text-gray-900 font-medium">
                      {generatePaymentMutation.data.zelleId}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatePaymentMutation.data.zelleId, 'zelle', 'Zelle ID copied!')}
                    className="h-8 w-8 p-0"
                  >
                    {copyStatus.field === 'zelle' && copyStatus.status ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Recipient */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Recipient</div>
                <div className="font-medium text-gray-900">
                  {generatePaymentMutation.data.recipientName}
                </div>
              </div>
            </motion.div>

            {/* Verify Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto"
            >
              <Button
                onClick={() => toast.success('Payment verification started!')}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl"
              >
                Verify Payment
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AppComponent() {
  const [tab, setTab] = useState("home");
  const [amount, setAmount] = useState("");
  const { data: session } = useSession();
  const walletAddress = session?.user?.id as `0x${string}` | undefined;
  const username = session?.user?.username || "dipanshuhappy";
  const [showZelle, setShowZelle] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ field: string; status: boolean }>({ field: '', status: false });
  
  // USDC balance using wagmi
  const { data: balance, refetch, isLoading: isBalanceLoading } = useBalance({
    address: walletAddress,
    token: CONSTANTS['tokens'].usdc.address,
  });

  const copyToClipboard = async (text: string, field: string, successMessage: string) => {
    await navigator.clipboard.writeText(text);
    setCopyStatus({ field, status: true });
    toast.success(successMessage);
    setTimeout(() => setCopyStatus({ field: '', status: false }), 1200);
  };

  return (
    <div className="flex flex-col min-h-[90vh] bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4">
      <div className="flex-1 w-full max-w-md mx-auto">
        {tab === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 pt-8 pb-4"
          >
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-2"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome, {username}! 👋
              </h1>
              <p className="text-gray-600">Manage your wallet and transfers</p>
            </motion.div>

            {/* Balance Card - Main Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg shadow-blue-600/25">
                <CardContent className="p-6">
                  {/* Header with title left and refresh right */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-white/80 text-sm font-medium">Your Balance</div>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={async () => {
                        try {
                          await refetch();
                          toast.success('Balance refreshed!');
                        } catch (e) {
                          toast.error('Failed to refresh balance');
                        }
                      }} 
                      disabled={isBalanceLoading}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-8 w-8 p-0"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Amount centered with USDC on the side */}
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold text-white">
                      ${balance ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2) : "0.00"}
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      USDC
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              {/* Wallet Address */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 mb-1">Wallet Address</div>
                    <div className="font-mono text-sm text-gray-600 truncate">
                      {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` : 'Not connected'}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => walletAddress && copyToClipboard(walletAddress, 'wallet', 'Wallet address copied!')}
                    className="ml-3 h-8 w-8 p-0"
                    disabled={!walletAddress}
                  >
                    {copyStatus.field === 'wallet' && copyStatus.status ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Username */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-900 mb-1">Username</div>
                <div className="font-mono text-sm text-gray-600">{username}</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {tab === "wallet" && (
          <WalletTab 
            amount={amount}
            setAmount={setAmount}
            copyToClipboard={copyToClipboard}
            copyStatus={copyStatus}
          />
        )}
      </div>
      <Navigation value={tab} setValue={setTab} />
    </div>
  );
}