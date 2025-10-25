import { motion } from 'framer-motion';
import GradientBackdrop from '@/components/GradientBackdrop';

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <GradientBackdrop variant="section" />
      <main className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-6 text-5xl font-bold">Get Started</h1>
            <p className="text-xl text-white/80">Welcome! Let's begin your journey.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
