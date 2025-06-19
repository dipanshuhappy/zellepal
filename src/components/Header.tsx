'use client';
import Image from 'next/image';
import { AuthButton } from "./AuthButton"
import { ModeToggle } from "./mode-toggle"
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Haptic, TopBar} from '@worldcoin/mini-apps-ui-kit-react';
import { Button } from './ui/button';
import { Arrow } from '@radix-ui/react-dropdown-menu';

export function Header() {
  const router = useRouter();

  return (
    <div className="relative text-accent">
      <TopBar
        className='shadow-lg'
        endAdornment={<AuthButton />}
        startAdornment={
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            onClick={() => router.back()}
          >
            <ArrowLeft className='h-9 w-10'/>
          </Button>
        }
        title="ZellePal"
      />
    </div>
  )
} 