"use client"
import { useState } from "react";
import { Navigation } from "./Navigation";
import { UserInfo } from "./UserInfo";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useSession } from "next-auth/react";
import { Marble,Button as WorldButton } from '@worldcoin/mini-apps-ui-kit-react';
import { Button } from './ui/button';

import { useBalance } from "wagmi";
import {CONSTANTS} from "@/lib/constants"
import { formatUnits } from "viem";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
// import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {RefreshCcw} from  'lucide-react'
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AppComponent() {
  const [tab, setTab] = useState("home");
  const [amount, setAmount] = useState("");
  const { data: session } = useSession();
  const walletAddress = session?.user?.id as `0x${string}` | undefined;
  const username = session?.user?.username;
  const [showZelle, setShowZelle] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ field: string; status: boolean }>({ field: '', status: false });
  // USDC balance using wagmi
  const { data: balance,refetch, isLoading: isBalanceLoading } = useBalance({
    address: walletAddress,
    token: CONSTANTS['tokens'].usdc.address,
  });

  return (
    <div className="flex flex-col min-h-[90vh] bg-background px-2 sm:px-0">
      <div className="flex-1 w-full">
        {tab === "home" && (
          <div className="flex flex-col items-center gap-6 p-4">
            <Card className="w-full max-w-md mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center mb-2">Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="w-full flex flex-col gap-1">
                  <span className="text-base font-semibold text-muted-foreground">Wallet Address</span>
                  <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded w-full">
                    <span className="font-mono text-sm truncate max-w-[120px] sm:max-w-[200px]">
                      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ''}
                    </span>
                    <Button size="icon" variant="outline" onClick={async () => {
                      if (walletAddress) {
                        await navigator.clipboard.writeText(walletAddress);
                        setCopyStatus({ field: 'wallet', status: true });
                        toast.success('Wallet address copied!');
                        setTimeout(() => setCopyStatus({ field: '', status: false }), 1200);
                      }
                    }} aria-label="Copy wallet address">
                      {copyStatus.field === 'wallet' && copyStatus.status ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-1">
                  <span className="text-base font-semibold text-muted-foreground">Username</span>
                  <span className="font-mono text-sm break-all bg-muted px-2 py-1 rounded">{username}</span>
                </div>
                <div className="w-full flex flex-col gap-1">
                  <span className="text-base font-semibold text-muted-foreground flex items-center gap-2">USDC Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base break-all">{balance ? formatUnits(balance.value,balance.decimals) : "-"}</span>
                    <Button size="icon" variant="outline" onClick={async () => {
                      try {
                        await refetch();
                        toast.success('Balance refreshed!');
                      } catch (e) {
                        toast.error('Failed to refresh balance');
                      }
                    }} disabled={isBalanceLoading} aria-label="Refresh balance">
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {tab === "wallet" && (
          <div className="flex flex-col items-center justify-center gap-6 p-4 min-h-[60vh]">
            <motion.div
              className="w-full max-w-xs flex flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <Card className="w-full shadow-lg">
                <CardContent className="flex flex-col gap-4 p-4">
                  <label className="block text-base font-semibold mb-2 text-center text-muted-foreground">Enter Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setShowZelle(false); }}
                    placeholder="Amount in USD"
                    className="mb-2 text-center text-lg"
                  />
                  <Button className="w-full bg-accent text-primary-foreground font-semibold text-lg" onClick={() => setShowZelle(!!amount)} disabled={!amount}>
                    Generate Payment
                  </Button>
                </CardContent>
              </Card>
              <Separator className="my-4" />
              {/* Zelle details and exact amount (mockup) */}
              {showZelle && amount && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="w-full"
                >
                  <Card className="w-full shadow-md">
                    <CardContent className="space-y-4 p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-muted-foreground">Amount to Send</span>
                        <span className="text-xl font-bold text-green-600 flex items-center gap-2">${parseFloat(amount).toFixed(2)}
                          <Button size="icon" variant="outline" onClick={async () => {
                            await navigator.clipboard.writeText(parseFloat(amount).toFixed(2));
                            setCopyStatus({ field: 'amount', status: true });
                            toast.success('Amount copied to clipboard!');
                            setTimeout(() => setCopyStatus({ field: '', status: false }), 1200);
                          }} aria-label="Copy amount">
                            {copyStatus.field === 'amount' && copyStatus.status ? (
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                            )}
                          </Button>
                        </span>
                      </div>
                      <Separator className="bg-muted" />
                      <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-base text-muted-foreground">Zelle ID</span>
                          <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded break-all flex items-center gap-2">zelle@example.com
                            <Button size="icon" variant="outline" onClick={async () => {
                              await navigator.clipboard.writeText('zelle@example.com');
                              setCopyStatus({ field: 'zelle', status: true });
                              toast.success('Zelle ID copied to clipboard!');
                              setTimeout(() => setCopyStatus({ field: '', status: false }), 1200);
                            }} aria-label="Copy Zelle ID">
                              {copyStatus.field === 'zelle' && copyStatus.status ? (
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                              )}
                            </Button>
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-base text-muted-foreground">Recipient Name</span>
                          <span className="font-semibold text-base">John Doe</span>
                        </div>
                      </div>
                      <div className="flex justify-center mt-4">
                        <Button className="w-full bg-primary text-primary-foreground font-semibold text-lg" onClick={() => toast.info('Verify Payment feature coming soon!')}>Verify Payment</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </div>
      <Navigation value={tab} setValue={setTab} />
    </div>
  );
}