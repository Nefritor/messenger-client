import {useEffect, useState} from 'react';
import axios from 'axios';
import {formatDateTime} from '../../../Utils/Date';

const getUserData = (uuid, endpoint) => {
    return axios.post(`http://${endpoint}/get-userdata`, {uuid}).then(({data}) => {
        switch (data.type) {
            case 'success':
                return data.userData;
            default:
                return {};
        }
    });
}

export default function MessageBlock(props) {
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (props.sender !== 'me') {
            getUserData(props.uuid, props.endpoint).then((userData) => {
                if (userData.username) {
                    setUsername(userData.username);
                } else {
                    setUsername('Пользователь удалён');
                }
            });
        }
    }, [props.uuid, props.username, props.endpoint]);

    return (
        <div className={`messenger-main-list-messageBlock messenger-main-list-messageBlock-${props.sender}`}>
            {
                username &&
                <div className='messenger-main-list-messageBlock-username'>{username}</div>
            }
            <div className='messenger-main-list-messageBlock-text'>{props.text}</div>
            <div className='messenger-main-list-messageBlock-date'>{formatDateTime(props.date)}</div>
        </div>
    );
}