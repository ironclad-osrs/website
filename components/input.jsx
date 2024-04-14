import { forwardRef } from 'react'

import { cn } from '@/utils/class-names'

export const Input = forwardRef(({ className, label, type, ...rest }, ref) => (
  <label className={cn('block space-y-1', className)}>
    {label && (
      <span className='block text-sm'>
        {label}
      </span>
    )}
    <input
      {...rest}
      ref={ref}
      type={type ?? 'text'}
      className='w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm ring-1 ring-primary disabled:focus:ring-primary'
    />
  </label>
))

Input.displayName = 'input'
