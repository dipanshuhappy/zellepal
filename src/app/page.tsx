import Image from 'next/image';
import Link from 'next/link';
import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await auth();
  
  return (
    <Page>
      <Page.Main className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden w-full">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 w-screen h-full overflow-hidden">
          {/* Base Gradient Background */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 animate-gradient-shift"></div>
          
          {/* Secondary Moving Gradient */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-blue-100/40 via-transparent to-indigo-100/40 animate-pulse-slow"></div>
          
          {/* Floating Geometric Shapes - Container with overflow hidden */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Large Background Circles - Adjusted to stay within viewport */}
            <div className="absolute top-10 left-0 md:left-10 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-xl animate-float-slow"></div>
            <div className="absolute top-1/3 -right-20 md:right-16 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-cyan-200/15 to-blue-300/15 rounded-full blur-2xl animate-float-reverse"></div>
            <div className="absolute bottom-20 left-0 md:left-1/4 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-br from-indigo-200/25 to-purple-300/20 rounded-full blur-xl animate-float-diagonal"></div>
            
            {/* Medium Floating Elements */}
            <div className="absolute top-1/4 left-1/4 md:left-1/3 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-2xl rotate-45 animate-spin-slow blur-sm"></div>
            <div className="absolute bottom-1/3 right-1/4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-indigo-300/40 to-blue-400/30 rounded-full animate-bounce-gentle blur-sm"></div>
            
            {/* Small Particle-like Elements */}
            <div className="absolute top-16 right-1/4 md:right-1/3 w-6 md:w-8 h-6 md:h-8 bg-blue-400/50 rounded-full animate-ping-slow"></div>
            <div className="absolute bottom-1/4 left-4 md:left-16 w-4 md:w-6 h-4 md:h-6 bg-cyan-400/60 rounded-full animate-pulse-gentle"></div>
            <div className="absolute top-2/3 right-4 md:right-20 w-6 md:w-10 h-6 md:h-10 bg-indigo-400/40 rounded-full animate-float-tiny"></div>
            
            {/* Hexagonal Crypto-themed Elements */}
            <div className="absolute top-1/2 left-4 md:left-12 w-10 md:w-16 h-10 md:h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 clip-hexagon animate-rotate-slow"></div>
            <div className="absolute bottom-1/2 right-4 md:right-12 w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br from-cyan-400/30 to-blue-500/25 clip-hexagon animate-rotate-reverse"></div>
          </div>
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 w-full h-full opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #1d4ed8 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
          
          {/* Gradient Mesh Overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-blue-50/30 to-transparent animate-gradient-shift-vertical"></div>
        </div>
        
        {/* Main Content with Glassmorphism */}
        <div className="relative z-10 w-full max-w-xs mx-auto flex flex-col items-center gap-6 mt-8 px-4 sm:px-0">
          {/* Enhanced Card with Glassmorphism */}
          <div className="w-full flex flex-col items-center gap-6 p-6 sm:p-8 backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 hover:bg-white/50">
            
            {/* Logo with Glow Effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/30 rounded-xl blur-lg animate-pulse-gentle"></div>
              <Image
                src="/logo.jpeg"
                alt="ZellePal Logo"
                width={160}
                height={160}
                className="relative rounded-xl shadow-2xl shadow-blue-500/30 mb-2 hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            
            {/* Enhanced Title with Gradient */}
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent leading-tight animate-fade-in">
              ZellePal
            </h1>
            
            {/* Enhanced Description */}
            <p className="text-base text-center text-blue-800 font-medium leading-relaxed animate-fade-in-delay">
              Seamlessly convert <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Zelle</span> payments to <span className="font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">USDC</span> — all inside the World App.<br/>
              <span className="text-blue-700 font-medium">Get paid using Zelle from anywhere in the world.</span>
            </p>
            
            {/* Enhanced Button Container */}
            <div className="w-full mt-6">
              {!session ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg group-hover:blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                  <AuthButton />
                </div>
              ) : (
                <Link href="/app" className="w-full" passHref>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg group-hover:blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                    <Button 
                      className="relative w-full h-12 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl" 
                      size="lg"
                    >
                      Go to App
                    </Button>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced Floating Action Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Currency Symbols */}
          <div className="absolute top-1/4 left-8 text-blue-300/20 text-6xl font-bold animate-float-slow">$</div>
          <div className="absolute bottom-1/3 right-8 text-indigo-300/20 text-5xl font-bold animate-float-reverse">₿</div>
          <div className="absolute top-2/3 left-1/4 text-cyan-300/20 text-4xl font-bold animate-bounce-gentle">Ξ</div>
        </div>
      </Page.Main>
      
      {/* Enhanced Footer */}
      <Page.Footer className="relative z-10 backdrop-blur-sm bg-white/20 border-t border-white/30">
        <p className="text-xs text-center text-blue-600/80 w-full font-medium">
          &copy; {new Date().getFullYear()} ZellePal. Not affiliated with Zelle or World App.
        </p>
      </Page.Footer>
    </Page>
  );
}