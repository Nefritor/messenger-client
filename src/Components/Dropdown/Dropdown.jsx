import {useEffect, useState} from 'react';

import './Dropdown.css';

Dropdown.defaultProps = {
    caption: '',
    rightCaption: '',
    items: [],
    ItemContent: ({item}) => <div>{item.username}</div>
}

export default function Dropdown({caption, rightCaption, items, ItemContent}) {
    const [isPop, setIsPop] = useState(false)

    const onButtonClick = (event) => {
        event.stopPropagation();
        setIsPop(!isPop)
    }

    const mouseUpHandler = (event) => {
        if (isPop && event.target.getAttribute('is-list') !== 'true') {
            setIsPop(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', mouseUpHandler);
        return () => document.removeEventListener('click', mouseUpHandler);
    })

    return (
        <div className='messenger-dropdown-wrapper'>
            <div className='messenger-dropdown'
                 onClick={onButtonClick}>
                <span>{caption}</span>
                &nbsp;
                <span>{rightCaption}</span>
            </div>
            {
                isPop &&
                <div className='messenger-dropdown-list'>
                    {
                        items.map((item, index) => <ItemContent key={index} {...item}/>)
                    }
                </div>
            }
        </div>
    )
}