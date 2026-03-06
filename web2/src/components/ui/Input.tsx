'use client'

import { forwardRef, type InputHTMLAttributes, type ElementType } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ElementType
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className, id, ...rest }, ref) => {
    const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
              <Icon className="w-[18px] h-[18px]" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input-dark',
              Icon && 'pl-11',
              error && 'border-red-400/50 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.1)]',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-xs text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
