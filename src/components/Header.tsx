'use client';
import Image from 'next/image';
import { AuthButton } from "./AuthButton"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-md">
      <div className="flex h-16 sm:h-20 items-center justify-between px-2 sm:px-6 max-w-full">
        {/* Back Button */}
        <div className="flex items-center w-10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/90 hover:bg-white/10"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
     
        {/* Auth Button & Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* <ModeToggle /> */}
          <AuthButton />
        </div>
      </div>
    </header>
  )
} 