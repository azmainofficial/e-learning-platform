import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-datacamp-gray-200 bg-white text-datacamp-gray-900 focus:border-datacamp-navy focus:ring-datacamp-navy rounded-lg shadow-sm ' +
                className
            }
            ref={input}
        />
    );
});
