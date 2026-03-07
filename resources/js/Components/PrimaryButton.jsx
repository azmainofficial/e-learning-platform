export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2.5 bg-blue-600 border border-transparent rounded-lg font-semibold text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-800 transition ease-in-out duration-150 ${disabled && 'opacity-50 cursor-not-allowed'} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
