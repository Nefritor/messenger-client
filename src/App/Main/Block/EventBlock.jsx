import {useEffect, useState} from 'react';
import axios from 'axios';

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

const formatDate = (time) => {
    const date = new Date(time);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (time < now) {
        return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    }
    return date.toLocaleTimeString();
}

export default function EventBlock(props) {
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (props.username) {
            setUsername(props.username);
        } else {
            getUserData(props.uuid, props.endpoint).then((userData) => {
                if (userData.username) {
                    setUsername(userData.username);
                } else {
                    setUsername('[Пользователь удалён]');
                }
            });
        }
    }, [props.uuid, props.endpoint]);

    const getEventCaption = () => {
        switch (props.event) {
            case 'connection':
                return `${username} вошёл в чат`;
            case 'disconnection':
                return `${username} вышел из чата`;
        }
    }

    return (
        <div className='messenger-main-list-eventBlock'>
            <div className='messenger-main-list-eventBlock-text'>{getEventCaption()}</div>
            <div className='messenger-main-list-eventBlock-divider'/>
            <div className='messenger-main-list-eventBlock-date'>{formatDate(props.date)}</div>
        </div>
    );
}