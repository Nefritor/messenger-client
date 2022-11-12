import {useEffect, useRef} from 'react';
import './Input.css';

Input.defaultProps = {
    className: '',
    inputClassName: '',
    type: 'text',
    placeholder: '',
    onChange: () => undefined,
    onSubmit: () => undefined,
    value: '',
    errorText: ''
}

const getButtonClassName = (isError, additionalClassName) => {
    let className = 'messenger-input-block';
    if (isError) {
        className += ' messenger-input-error';
    }
    if (additionalClassName) {
        className += ` ${additionalClassName}`;
    }
    return className;
}

export default function Input(
    {
        className,
        inputClassName,
        type,
        placeholder,
        value,
        errorText,
        onChange,
        onSubmit,
        onRefInit
    }
) {
    const inputRef = useRef(null);

    const submit = (event) => {
        event.preventDefault();
        onSubmit();
    }

    useEffect(() => {
        if (onRefInit) {
            onRefInit(inputRef);
        }
    }, [inputRef]);

    return (
        <form className={`messenger-input ${className}`}
              onSubmit={submit}
              onClick={() => inputRef.current.focus()}>
            {
                placeholder &&
                <div className={value ? 'messenger-input-placeholder-top' : 'messenger-input-placeholder-in'}>
                    {placeholder}
                </div>
            }
            <input ref={inputRef}
                   className={getButtonClassName(!!errorText, inputClassName)}
                   type={type}
                   value={value}
                   onChange={(e) => onChange(e.target.value)}/>
        </form>
    );
}