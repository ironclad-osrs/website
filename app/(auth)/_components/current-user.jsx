'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { ChevronDown, Cog, LogOut } from 'lucide-react'

import {
  FloatingOverlay,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions
} from '@floating-ui/react'

import { signOut } from '@/actions/sign-out'
import { usePathname } from 'next/navigation'

const NavLink = ({ icon: Icon, content, ...rest }) => {
  return (
    <li>
      <Link
        {...rest}
        className='flex items-center gap-2 rounded-md py-2 pl-2 pr-6 active:bg-primary-faint md:py-1.5'
      >
        <Icon className='size-4 text-primary-muted' />
        <span>{content}</span>
      </Link>
    </li>
  )
}

const NavButton = ({ icon: Icon, content, ...rest }) => {
  return (
    <button
      {...rest}
      className='flex items-center gap-2 rounded-md py-2 pl-2 pr-6 active:bg-primary-faint md:py-1.5'
    >
      <Icon className='size-4 text-primary-muted' />
      <span>{content}</span>
    </button>
  )
}

export const CurrentUser = ({ user }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      autoPlacement({
        allowedPlacements: ['bottom-start', 'bottom-end']
      }),
      offset(4),
      shift({ padding: 4 })
    ]
  })

  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <button
        ref={refs.setReference}
        className='ml-auto flex items-center gap-2'
        onClick={() => setOpen((v) => !v)}
        {...getReferenceProps()}
      >
        <span>{user}</span>
        <ChevronDown className='size-4 text-primary-faint' />
      </button>
      {process.browser &&
        createPortal(
          open && (
            <>
              <FloatingOverlay className='bg-primary/50'>
                <div
                  ref={refs.setFloating}
                  className='rounded-md bg-primary p-1 text-sm ring-1 ring-primary'
                  style={floatingStyles}
                  {...getFloatingProps()}
                >
                  <ul className='space-y-1'>
                    <NavLink href='/dashboard/settings' content='Settings' icon={Cog} />
                    <li>
                      <form action={signOut}>
                        <NavButton content='Sign out' icon={LogOut} />
                      </form>
                    </li>
                  </ul>
                </div>
              </FloatingOverlay>
            </>
          ),
          document.body
        )}
    </>
  )
}
