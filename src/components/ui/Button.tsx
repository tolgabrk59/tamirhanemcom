'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className = '',
            variant = 'primary',
            size = 'md',
            loading = false,
            fullWidth = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
            inline-flex items-center justify-center gap-2
            font-semibold rounded-lg transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            btn-interactive
        `;

        const variants = {
            primary: `
                bg-gradient-to-r from-primary-500 to-primary-600
                text-gray-900
                hover:from-primary-400 hover:to-primary-500
                focus-visible:ring-primary-500
                shadow-sm hover:shadow-md
            `,
            secondary: `
                bg-secondary-100
                text-secondary-700
                hover:bg-secondary-200
                focus-visible:ring-secondary-500
            `,
            outline: `
                border-2 border-secondary-300
                text-secondary-700
                hover:bg-secondary-50 hover:border-secondary-400
                focus-visible:ring-secondary-500
            `,
            ghost: `
                text-secondary-600
                hover:bg-secondary-100
                focus-visible:ring-secondary-500
            `,
            danger: `
                bg-error-500
                text-white
                hover:bg-error-600
                focus-visible:ring-error-500
            `,
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm min-h-[36px]',
            md: 'px-4 py-2 text-sm min-h-[44px]',
            lg: 'px-6 py-3 text-base min-h-[52px]',
        };

        return (
            <button
                ref={ref}
                className={`
                    ${baseStyles}
                    ${variants[variant]}
                    ${sizes[size]}
                    ${fullWidth ? 'w-full' : ''}
                    ${className}
                `.trim().replace(/\s+/g, ' ')}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {!loading && leftIcon}
                {children}
                {!loading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;

// Icon Button variant
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className = '', variant = 'ghost', size = 'md', children, ...props }, ref) => {
        const baseStyles = `
            inline-flex items-center justify-center
            rounded-lg transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
        `;

        const variants = {
            primary: 'bg-primary-500 text-gray-900 hover:bg-primary-400 focus-visible:ring-primary-500',
            secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus-visible:ring-secondary-500',
            ghost: 'text-secondary-600 hover:bg-secondary-100 focus-visible:ring-secondary-500',
            danger: 'text-error-500 hover:bg-error-50 focus-visible:ring-error-500',
        };

        const sizes = {
            sm: 'w-11 h-11 min-w-[44px] min-h-[44px]',
            md: 'w-11 h-11 min-w-[44px] min-h-[44px]',
            lg: 'w-12 h-12 min-w-[48px] min-h-[48px]',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim().replace(/\s+/g, ' ')}
                {...props}
            >
                {children}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';
