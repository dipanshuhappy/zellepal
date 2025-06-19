"use client"
import Image from 'next/image';
import { Page } from '@/components/PageLayout';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import  {WorldSignInButton} from "@/components/WorldSignInButton"

export default function Home() {
  const steps = [
    {
      title: 'Login with World',
    },
    {
      title: 'Enter Amount',
    },
    {
      title: 'Zelle exact amount and get in your world wallet',
    },
  ];

  return (
    <Page>
      <Page.Main className="relative flex flex-col items-center justify-center min-h-screen p-4 w-full gap-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-2"
        >
          <Image src="/logo.png" alt="ZellePal Logo" width={120} height={120} className="rounded-xl shadow-md" priority />
          <h1 className="text-2xl font-bold text-center mt-2">ZellePal</h1>
        </motion.div>
        <div className="flex flex-col gap-6 w-full max-w-xs mx-auto mt-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.2, duration: 0.5 }}
              className="flex items-center gap-3 bg-white/80 dark:bg-zinc-900/80 rounded-lg shadow p-4"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold shrink-0">{idx + 1}</span>
              <span className="text-base font-medium">{step.title}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full mt-8 grid place-items-center"
        >
          <WorldSignInButton />
        </motion.div>
      </Page.Main>
      <Page.Footer className="relative z-10 backdrop-blur-sm bg-white/20 border-t border-white/30">
        <p className="text-xs text-center w-full font-medium">
          &copy; {new Date().getFullYear()} ZellePal. Not affiliated with Zelle or World App.
        </p>
      </Page.Footer>
    </Page>
  );
}