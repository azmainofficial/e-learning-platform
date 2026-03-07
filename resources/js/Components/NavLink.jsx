import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
                (active
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
