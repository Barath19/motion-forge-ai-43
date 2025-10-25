import { useEffect, useRef } from 'react';
import { Package, Sparkles, Palette } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Package,
    title: 'Product-first storytelling',
    description: 'Craft narratives that showcase your product as the hero of every frame.',
  },
  {
    icon: Sparkles,
    title: 'AI storyboard assistant',
    description: 'Generate scene-by-scene breakdowns with smart visual direction suggestions.',
  },
  {
    icon: Palette,
    title: 'Moodboard intelligence',
    description: 'Upload references and let AI understand your aesthetic instantly.',
  },
];

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Create campaigns that actually convert
          </h2>
        </div>

        <div className="features-grid grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card glass rounded-2xl p-8 hover:glass-strong transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:shadow-glow-primary transition-shadow duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
