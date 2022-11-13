import {useEffect, useState} from 'react';
import './SwitchContent.css';

SwitchContent.defaultProps = {
    configs: [],
    value: null,
    offset: 300
}

let timeoutId;

export default function SwitchContent({configs, offset, value, children}) {
    const [contentData, setContentData] = useState({
        show: value,
        hide: null
    });

    useEffect(() => {
        setContentData({
            hide: contentData.show,
            show: value
        });
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            setContentData({
                hide: null,
                show: value
            })
        }, 300);
    }, [value]);


    const getBlockStyle = (key) => {
        switch (key) {
            case contentData.show:
                return {
                    opacity: 1,
                    transform: `translateY(${0}px)`
                };
            case contentData.hide:
                return {
                    opacity: 0,
                    transform: `translateY(${offset}px)`
                };
            default:
                return {
                    opacity: 0,
                    zIndex: -1,
                    transform: `translateY(${offset}px)`
                };
        }
    }

    return (
        <>
            <div style={{flexGrow: value === null ? 0 : 1}}
                 className='messenger-switch-content'>
                {
                    configs.map((data) => (
                        <div key={data.key}
                             style={getBlockStyle(data.key)}
                             className='messenger-switch-content-block'>
                            {data.content}
                        </div>
                    ))
                }
            </div>
            {
                children &&
                <div className='messenger-switch-content-bottom'>{children}</div>
            }
        </>
    )
}