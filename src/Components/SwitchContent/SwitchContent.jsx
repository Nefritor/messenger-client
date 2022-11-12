import {useEffect, useState} from 'react';
import './SwitchContent.css';

SwitchContent.defaultProps = {
    configs: [],
    value: null
}

let timeoutId;

export default function SwitchContent({configs, height, value}) {
    const [contentData, setContentData] = useState({
        show: null,
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
        }, 500);
    }, [value]);


    const getBlockStyle = (key) => {
        switch (key) {
            case contentData.show:
                return {
                    opacity: 1,
                    marginBottom: 0
                };
            case contentData.hide:
                return {
                    opacity: 0,
                    marginBottom: -height
                };
            default:
                return {
                    opacity: 0,
                    marginBottom: -height
                };
        }
    }

    const getContentStyle = () => ({
        height: value === null ? 0 : height
    })

    return (
        <div style={getContentStyle()}
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
    )
}