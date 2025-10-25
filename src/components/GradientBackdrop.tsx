import clsx from 'clsx';

type GradientBackdropProps = {
  variant?: 'hero' | 'section';
  className?: string;
};

const GradientBackdrop = ({ variant = 'hero', className }: GradientBackdropProps) => {
  const heroLayers = [
    'animate-aurora absolute -inset-[30%] rounded-full bg-[radial-gradient(circle_at_top_left,rgba(255,0,122,0.55),transparent_65%)] blur-3xl opacity-70',
    'animate-aurora-delayed absolute -right-[25%] top-[-10%] h-[120%] w-[90%] rounded-full bg-[radial-gradient(circle_at_center,rgba(77,61,255,0.45),transparent_70%)] blur-3xl opacity-75',
    'animate-aurora-slow absolute left-[-15%] top-[35%] h-[110%] w-[90%] rounded-full bg-[radial-gradient(circle_at_center,rgba(33,246,255,0.35),transparent_75%)] blur-[140px] opacity-60'
  ];

  const sectionLayers = [
    'animate-aurora absolute -inset-[35%] rounded-full bg-[radial-gradient(circle_at_top,rgba(255,0,122,0.45),transparent_70%)] blur-[160px] opacity-60',
    'animate-aurora-delayed absolute inset-y-[-25%] left-[-20%] h-[160%] w-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(77,61,255,0.35),transparent_75%)] blur-[180px] opacity-60',
    'animate-aurora-slow absolute inset-y-[-30%] right-[-15%] h-[160%] w-[85%] rounded-full bg-[radial-gradient(circle_at_center,rgba(33,246,255,0.3),transparent_80%)] blur-[180px] opacity-55'
  ];

  const overlays = [
    'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]',
    'pointer-events-none absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/10'
  ];

  const layers = variant === 'hero' ? heroLayers : sectionLayers;

  return (
    <div className={clsx('absolute inset-0 -z-10 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-black" />
      {layers.map(layer => (
        <div key={layer} className={layer} />
      ))}
      {variant === 'section' && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
      )}
      {variant === 'hero' && overlays.map(overlay => <div key={overlay} className={overlay} />)}
    </div>
  );
};

export default GradientBackdrop;
