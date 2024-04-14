import { forwardRef } from 'react'

import { cn } from '@/utils/class-names'

export const Button = forwardRef(({ children, className, type, theme, ...rest }, ref) => (
  <button
    {...rest}
    ref={ref}
    type={type}
    className={cn(
      'relative px-3 py-2',
      'ring-1 ring-primary rounded-md',
      'text-sm',
      'active:text-primary-loud active:bg-primary-faint',
      theme === 'muted' && [
        'ring-0',
        'text-primary-muted'
      ],
      className
    )}
  >
    <span className='flex items-center justify-center gap-2'>
      {children}
    </span>
  </button>
))

Button.displayName = 'Button'
