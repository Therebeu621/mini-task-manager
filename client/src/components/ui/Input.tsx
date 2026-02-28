import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, error, className = '', id, ...props },
    ref,
) {
    return (
        <label className="ui-field" htmlFor={id}>
            {label && <span className="ui-field__label">{label}</span>}
            <input ref={ref} id={id} className={`ui-input ${className}`.trim()} {...props} />
            {error && <span className="ui-field__error">{error}</span>}
        </label>
    );
});
