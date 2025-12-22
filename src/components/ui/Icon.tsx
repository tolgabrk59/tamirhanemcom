'use client';

import { LucideProps, icons } from 'lucide-react';
import { forwardRef } from 'react';

// Common icon names used in the app
export type IconName =
    | 'search'
    | 'mapPin'
    | 'star'
    | 'starHalf'
    | 'phone'
    | 'clock'
    | 'calendar'
    | 'check'
    | 'checkCircle'
    | 'x'
    | 'xCircle'
    | 'chevronDown'
    | 'chevronUp'
    | 'chevronLeft'
    | 'chevronRight'
    | 'arrowRight'
    | 'arrowLeft'
    | 'menu'
    | 'heart'
    | 'heartFilled'
    | 'user'
    | 'settings'
    | 'home'
    | 'car'
    | 'wrench'
    | 'tool'
    | 'shield'
    | 'shieldCheck'
    | 'badge'
    | 'info'
    | 'alertTriangle'
    | 'alertCircle'
    | 'loader'
    | 'refresh'
    | 'filter'
    | 'sort'
    | 'grid'
    | 'list'
    | 'eye'
    | 'eyeOff'
    | 'copy'
    | 'share'
    | 'download'
    | 'upload'
    | 'trash'
    | 'edit'
    | 'plus'
    | 'minus'
    | 'externalLink';

// Map common names to lucide icon names
// Using string type to avoid strict type checking issues with lucide-react version changes
const iconMap: Record<IconName, string> = {
    search: 'Search',
    mapPin: 'MapPin',
    star: 'Star',
    starHalf: 'StarHalf',
    phone: 'Phone',
    clock: 'Clock',
    calendar: 'Calendar',
    check: 'Check',
    checkCircle: 'CircleCheck',
    x: 'X',
    xCircle: 'CircleX',
    chevronDown: 'ChevronDown',
    chevronUp: 'ChevronUp',
    chevronLeft: 'ChevronLeft',
    chevronRight: 'ChevronRight',
    arrowRight: 'ArrowRight',
    arrowLeft: 'ArrowLeft',
    menu: 'Menu',
    heart: 'Heart',
    heartFilled: 'Heart',
    user: 'User',
    settings: 'Settings',
    home: 'Home',
    car: 'Car',
    wrench: 'Wrench',
    tool: 'Wrench',
    shield: 'Shield',
    shieldCheck: 'ShieldCheck',
    badge: 'BadgeCheck',
    info: 'Info',
    alertTriangle: 'AlertTriangle',
    alertCircle: 'AlertCircle',
    loader: 'Loader2',
    refresh: 'RefreshCw',
    filter: 'Filter',
    sort: 'ArrowUpDown',
    grid: 'LayoutGrid',
    list: 'List',
    eye: 'Eye',
    eyeOff: 'EyeOff',
    copy: 'Copy',
    share: 'Share2',
    download: 'Download',
    upload: 'Upload',
    trash: 'Trash2',
    edit: 'Pencil',
    plus: 'Plus',
    minus: 'Minus',
    externalLink: 'ExternalLink',
};

export interface IconProps extends Omit<LucideProps, 'ref'> {
    name: IconName;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    spin?: boolean;
}

const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
};

const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ name, size = 'md', spin = false, className = '', ...props }, ref) => {
        const iconName = iconMap[name] as keyof typeof icons;
        const LucideIcon = icons[iconName];

        if (!LucideIcon) {
            console.warn(`Icon "${name}" not found`);
            return null;
        }

        return (
            <LucideIcon
                ref={ref}
                size={sizeMap[size]}
                className={`${spin ? 'animate-spin' : ''} ${className}`.trim()}
                {...props}
            />
        );
    }
);

Icon.displayName = 'Icon';

export default Icon;

// Convenience exports for commonly used icons
export {
    Search,
    MapPin,
    Star,
    StarHalf,
    Phone,
    Clock,
    Calendar,
    Check,
    CircleCheck,
    X,
    CircleX,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    ArrowLeft,
    Menu,
    Heart,
    User,
    Settings,
    Home,
    Car,
    Wrench,
    Shield,
    ShieldCheck,
    BadgeCheck,
    Info,
    AlertTriangle,
    AlertCircle,
    Loader2,
    RefreshCw,
    Filter,
    ArrowUpDown,
    LayoutGrid,
    List,
    Eye,
    EyeOff,
    Copy,
    Share2,
    Download,
    Upload,
    Trash2,
    Pencil,
    Plus,
    Minus,
    ExternalLink,
} from 'lucide-react';
