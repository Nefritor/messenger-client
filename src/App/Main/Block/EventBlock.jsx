import {formatDateTime} from '../../../Utils/Date';

export default function EventBlock({username, date, event, type}) {
    const getEventCaption = () => {
        const metaText = (() => {
            switch (event) {
                case 'connection':
                    return 'вошел в чат';
                case 'disconnection':
                    return 'вышел из чата';
            }
        })();
        return <>
            <span className={type === '1' ? ' messenger-main-user-master' : ''}>{username}</span>
            &nbsp;
            <span>{metaText}</span>
        </>
    }

    return (
        <div className='messenger-main-list-eventBlock'>
            <div className='messenger-main-list-eventBlock-text'>{getEventCaption()}</div>
            <div className='messenger-main-list-eventBlock-divider'/>
            <div className='messenger-main-list-eventBlock-date'>{formatDateTime(date)}</div>
        </div>
    );
}