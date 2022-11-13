import {useEffect, useState} from 'react';

import './Infobox.css';

let timeoutId;

Infobox.defaultProps = {
    value: '',
    type: 'error',
    timeout: 10000
}

export default function Infobox({value, type, timeout, onValueChanged}) {
    const [errorText, setErrorText] = useState(value);

    const updateText = (value) => {
        setErrorText(value);
        onValueChanged(value);
    }

    useEffect(() => {
        if (errorText !== value) {
            updateText(value);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                updateText('');
            }, timeout);
        }
    }, [value])

    return (
        <>
            {
                errorText &&
                <div className={`messenger-infobox-${type}`}>
                    <div className='messenger-infobox-block'>
                        {errorText}
                    </div>
                </div>
            }
        </>
    )
}