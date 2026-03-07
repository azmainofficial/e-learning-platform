export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-6 py-2.5 bg-datacamp-green border border-transparent rounded-lg font-bold text-sm text-gray-900 hover:bg-datacamp-green-dark focus:bg-datacamp-green-dark active:bg-datacamp-green-dark focus:outline-none focus:ring-2 focus:ring-datacamp-green focus:ring-offset-2 transition ease-in-out duration-150 ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
