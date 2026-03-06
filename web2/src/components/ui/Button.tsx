'use client'

import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  loading?: boolean
  href?: string
  children: ReactNode
  className?: string
}

type ButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-gold',
  ghost: 'btn-ghost',
  outline: [
    'relative inline-flex items-center justify-center font-display font-semibold',
    'rounded-xl transition-all duration-300',
    'border border-white/10 text-white',
    'hover:border-white/20 hover:bg-white/5',
  ].join(' '),
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      loading = false,
      href,
      children,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const classes = cn(
      variantClasses[variant],
      sizeClasses[size],
      isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      className
    )

    const content = (
      <>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
      </>
    )

    if (href && !isDisabled) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex"
        >
          <Link href={href} className={classes}>
            {content}
          </Link>
        </motion.div>
      )
    }

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        className={classes}
        disabled={isDisabled}
        {...(rest as HTMLMotionProps<'button'>)}
      >
        {content}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
