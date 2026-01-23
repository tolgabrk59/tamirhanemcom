'use client';

import { forwardRef, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', variant = 'default', padding = 'md', children, ...props }, ref) => {
        const variants = {
            default: 'bg-white rounded-xl border border-gray-100 shadow-sm',
            elevated: 'bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow',
            outlined: 'bg-white rounded-xl border-2 border-gray-200',
            interactive: `
                bg-white rounded-xl border border-gray-100 shadow-sm
                hover:shadow-lg hover:border-primary-200
                transition-all duration-300 cursor-pointer
            `,
        };

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-4 sm:p-6',
            lg: 'p-6 sm:p-8',
        };

        return (
            <div
                ref={ref}
                className={`${variants[variant]} ${paddings[padding]} ${className}`.trim().replace(/\s+/g, ' ')}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;

// Card sub-components
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className = '', title, description, action, ...props }, ref) => (
        <div ref={ref} className={`flex items-start justify-between gap-4 mb-4 ${className}`} {...props}>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {description && <p className="text-sm text-secondary-500 mt-1">{description}</p>}
            </div>
            {action}
        </div>
    )
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className = '', children, ...props }, ref) => (
        <div ref={ref} className={className} {...props}>
            {children}
        </div>
    )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className = '', children, ...props }, ref) => (
        <div
            ref={ref}
            className={`mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
);

CardFooter.displayName = 'CardFooter';

// Feature Card for homepage sections
export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
    icon: React.ReactNode;
    title: string;
    description: string;
    iconColor?: string;
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
    ({ className = '', icon, title, description, iconColor = 'text-primary-500', ...props }, ref) => (
        <div
            ref={ref}
            className={`
                bg-white rounded-xl p-6 shadow-sm border border-gray-100
                hover:shadow-lg hover:border-primary-200
                transition-all duration-300 group
                ${className}
            `.trim().replace(/\s+/g, ' ')}
            {...props}
        >
            <div className={`w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${iconColor}`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-secondary-500">{description}</p>
        </div>
    )
);

FeatureCard.displayName = 'FeatureCard';

// Stat Card for metrics display
export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
    ({ className = '', label, value, icon, trend, ...props }, ref) => (
        <div
            ref={ref}
            className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${className}`}
            {...props}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary-500">{label}</span>
                {icon && <span className="text-secondary-400">{icon}</span>}
            </div>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {trend && (
                    <span className={`text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>
        </div>
    )
);

StatCard.displayName = 'StatCard';
