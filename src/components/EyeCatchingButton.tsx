import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';

export const EyeCatchingButton_v5 = ({ className, ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(
        'px-8 py-4 text-xl rounded-2xl font-bold tracking-wide transition-all',
        'bg-gradient-to-l text-transparent dark:text-transparent bg-clip-text animate-text-gradient bg-[length:300%]',
        'from-purple-300 via-purple-500 to-purple-300',
        'dark:from-purple-200 dark:via-purple-400 dark:to-purple-300',
        'border-white/20 hover:border-purple-400/60 hover:bg-purple-500/15 hover:text-transparent hover:from-purple-200 hover:via-purple-500 hover:to-purple-200 hover:shadow-[0_0_45px_rgba(168,85,247,0.35)]',
        className
      )}
    />
  );
};
