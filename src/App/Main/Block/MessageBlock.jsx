import {formatDateTime} from '../../../Utils/Date';

export default function MessageBlock({sender, uuid, username, type, text, date}) {
    return (
        <div className={`messenger-main-list-messageBlock messenger-main-list-messageBlock-${sender}`}>
            {
                sender !== 'me' &&
                <div className={
                    'messenger-main-list-messageBlock-username'.concat(
                        type === '1' ? ' messenger-main-user-master' : '')
                }>{username}</div>
            }
            <div className='messenger-main-list-messageBlock-text'>{text}</div>
            <div className='messenger-main-list-messageBlock-date'>{formatDateTime(date)}</div>
        </div>
    );
}