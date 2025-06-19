"use client"
import Image from "next/image";
import { Page } from "@/components/PageLayout";
import { motion } from "framer-motion";
import { WorldSignInButton } from "@/components/WorldSignInButton";

export default function HomeComponent() {
  const steps = [
    {
      icon: "🌍",
      title: "Connect World",
      description: "Link your World wallet securely"
    },
    {
      icon: "💰",
      title: "Enter Amount", 
      description: "Specify how much to send"
    },
    {
      icon: "⚡",
      title: "Zelle Transfer",
      description: "Funds appear in your wallet immediately"
    }
  ];

  return (
    <Page>
      <Page.Main className="flex flex-col min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center pt-12 pb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25">
              <span className="text-xl font-bold text-white">Z</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ZellePal</h1>
             
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 px-6 pb-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-10"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Send Zelle Receive USDC in your World App
            </h2>
            
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-10"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600">
                    {index + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="w-full mx-auto flex justify-center items-center">  <WorldSignInButton /> </div>
           
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Instant</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>World ID</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="px-6 py-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm"
        >
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            © {new Date().getFullYear()} ZellePal • Independent service not affiliated with Zelle or World App
          </p>
        </motion.footer>
      </Page.Main>
    </Page>
  );
}