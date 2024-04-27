import { cn } from '@/utils/class-names'

export const Wrapper = ({ children, className }) => (
  <div
    className={cn(
      'mx-auto px-4 w-full max-w-screen-md space-y-8',
      className
    )}
  >
    {children}
  </div>
)
