import {useEffect, useRef} from 'react';
import './Input.css';

Input.defaultProps = {
    className: '',
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

export default function Input(props) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (props.onRefInit) {
            props.onRefInit(inputRef);
        }
    }, [inputRef]);

    const onSubmit = (event) => {
        event.preventDefault();
        props.onSubmit();
    }

    return (
        <form className='messenger-input'
              onSubmit={(e) => onSubmit(e)}
              onClick={() => inputRef.current.focus()}>
            {
                props.placeholder &&
                <div className={props.value ? 'messenger-input-placeholder-top' : 'messenger-input-placeholder-in'}>
                    {props.placeholder}
                </div>
            }
            <input ref={inputRef}
                   className={getButtonClassName(!!props.errorText, props.className)}
                   type={props.type}
                   value={props.value}
                   onChange={(e) => props.onChange(e.target.value)}/>
        </form>
    );
}