import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GradientBackdrop from '@/components/GradientBackdrop';
import Hero from '@/components/Hero';
import { EyeCatchingButton_v5 } from '@/components/EyeCatchingButton';

const Index = () => {
  return <div className="min-h-screen bg-transparent text-white">
      <main>
        <Hero />
        <section className="relative min-h-screen overflow-hidden bg-black text-white">
          <GradientBackdrop variant="section" />
          <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              className="group relative inline-flex items-center justify-center"
            >
              <Link to="/get-started">
                <EyeCatchingButton_v5
                  size="lg"
                  className="rounded-[32px] px-10 py-5 text-2xl"
                >
                  Get Started
                </EyeCatchingButton_v5>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>;
};
export default Index;
