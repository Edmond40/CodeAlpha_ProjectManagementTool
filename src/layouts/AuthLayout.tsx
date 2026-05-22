import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>

      {/* Right Column - Decorative Graphic */}
      <div className="relative hidden w-0 flex-1 lg:block overflow-hidden bg-primary-900">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 z-0" />
        
        {/* Animated Floating Shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/4 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Manage projects <br />
              with <span className="text-primary-300">precision.</span>
            </h1>
            <p className="text-lg text-primary-100 max-w-lg leading-relaxed">
              TaskFlow brings your team's work together in one beautifully designed, lightning-fast workspace. Plan, track, and accomplish more.
            </p>

            {/* Mock Dashboard Preview Graphic */}
            <div className="mt-12 relative w-full max-w-2xl">
              <div className="glass-card rounded-2xl p-4 shadow-2xl border-white/10 bg-white/10 backdrop-blur-md">
                <div className="flex gap-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-3">
                  <div className="h-8 bg-white/20 rounded-lg w-1/3" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-4/5" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
