import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${active
                    ? 'border-cinematic-gold text-gray-900 bg-white/5 focus:text-gray-900 focus:bg-white/10 focus:border-cinematic-gold'
                    : 'border-transparent text-cinematic-silver/60 hover:text-gray-900 hover:bg-white/5 hover:border-gray-200 focus:text-gray-900 focus:bg-white/5 focus:border-gray-200'
                } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
