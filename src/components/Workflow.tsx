import { useEffect, useRef } from 'react';
import { Target, Lightbulb, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: Target,
    title: 'Define the product',
    description: 'Set your target audience, value proposition, and key features.',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Ideate the story',
    description: 'Choose a narrative structure and craft compelling story beats.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Polish the mood',
    description: 'Upload references and refine the visual aesthetic.',
  },
];

const scenes = [
  { title: 'Hook', description: 'Grab attention immediately', duration: '3s' },
  { title: 'Problem', description: 'Present the pain point', duration: '4s' },
  { title: 'Solution', description: 'Introduce your product', duration: '5s' },
  { title: 'CTA', description: 'Drive action', duration: '3s' },
];

const Workflow = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.workflow-left', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
      });
      gsap.from('.workflow-right', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="workflow" ref={sectionRef} className="py-20 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Steps */}
          <div className="workflow-left space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold mb-12">
              Your workflow, streamlined
            </h2>
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-accent font-bold mb-1">{step.number}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Timeline */}
          <div className="workflow-right">
            <div className="glass-strong rounded-2xl p-8 shadow-glow">
              <h3 className="text-xl font-bold mb-6">Timeline Example</h3>
              <div className="space-y-4">
                {scenes.map((scene, index) => (
                  <div
                    key={index}
                    className="glass rounded-xl p-4 hover:glass-strong transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{scene.title}</h4>
                      <span className="text-xs glass px-3 py-1 rounded-full">
                        {scene.duration}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{scene.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Duration</span>
                  <span className="font-bold text-accent">15s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
