'use client';
import { walletAuth } from '@/auth/wallet';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useSession, signOut } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBalance } from 'wagmi';
import { CONSTANTS } from '@/lib/constants';
import { formatUnits } from 'viem';

/**
 * This component is an example of how to authenticate a user
 * We will use Next Auth for this example, but you can use any auth provider
 * Read More: https://docs.world.org/mini-apps/commands/wallet-auth
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isInstalled } = useMiniKit();
  const { data: session, status } = useSession();
  const { data: usdcBalance, isLoading: isBalanceLoading } = useBalance({
    address: session?.user?.id as `0x${string}`,
    token: CONSTANTS.tokens.usdc.address,
    query:{
      refetchInterval: 4000,
      enabled: !!session?.user?.id,
    }
  })
  
  

  const onClick = useCallback(async () => {
    if (!isInstalled || isPending) {
      return;
    }
    setIsPending(true);
    try {
      await walletAuth();
    } catch (error) {
      console.error('Wallet authentication button error', error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
  }, [isInstalled, isPending]);

  useEffect(() => {
    const authenticate = async () => {
      if (isInstalled && !isPending && status === 'unauthenticated') {
        setIsPending(true);
        try {
          await walletAuth();
        } catch (error) {
          console.error('Auto wallet authentication error', error);
        } finally {
          setIsPending(false);
        }
      }
    };

    authenticate();
  }, [isInstalled, isPending, status]);

  if (status === 'authenticated' && session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full max-w-[280px] relative overflow-hidden transition-all duration-300",
              "hover:bg-accent/50",
              "active:scale-[0.98]",
              "shadow-sm hover:shadow-md",
              "text-base font-medium",
              "flex items-center justify-between gap-2",
              "rounded-xl",
              "h-12",
              "sm:h-14",
              "px-4"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <User className="w-5 h-5 shrink-0" />
              <div className="flex flex-col items-start">
                <span className="truncate text-sm sm:text-base">
                  {session.user.name || session.user.email || 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {session.user.id?.slice(0, 6)}...{session.user.id?.slice(-4)}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px] p-2" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.username || 'User'}
              </p>
              
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start p-2">
            <div className="flex items-center gap-2 w-full">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Wallet Address</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate w-full">
              {session.user.id || 'Not connected'}
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start p-2">
            <div className="flex items-center gap-2 w-full">
              <span className="text-sm font-medium">USDC Balance</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isBalanceLoading ? 'Loading...' : usdcBalance ? `${formatUnits(usdcBalance.value, CONSTANTS.tokens.usdc.decimals)} USDC` : '0 USDC'}
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <Button
        onClick={onClick}
        disabled={isPending}
        size="lg"
        variant="default"
        className={cn(
          "w-full relative overflow-hidden transition-all duration-300",
          "bg-gradient-to-r from-primary to-primary/80",
          "hover:from-primary/90 hover:to-primary/70",
          "active:scale-[0.98]",
          "shadow-lg hover:shadow-xl",
          "text-base font-semibold",
          "flex items-center justify-center gap-2",
          "rounded-xl",
          "h-12",
          "sm:h-14"
        )}
      >
        <Wallet className={cn(
          "w-5 h-5 transition-transform duration-300",
          isPending && "animate-pulse"
        )} />
        <span className="relative z-10">
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </span>
        {isPending && (
          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
        )}
      </Button>
      {!isInstalled && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Please install the World App to continue
        </p>
      )}
    </div>
  );
};
