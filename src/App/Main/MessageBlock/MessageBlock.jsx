import {useEffect, useState} from 'react';
import axios from 'axios';

const getUserData = (uuid) => {
    return axios.post('http://localhost:3001/get-userdata', {uuid}).then(({data}) => {
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
    now.setHours(0, 0, 0,0);
    if (time < now) {
        return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    }
    return date.toLocaleTimeString();
}

export default function MessageBlock(props) {
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (props.sender !== 'me') {
            getUserData(props.uuid).then((userData) => {
                if (userData.username) {
                    setUsername(userData.username);
                } else {
                    setUsername('Пользователь удалён');
                }
            });
        }
    }, [props.uuid, props.username]);

    return (
        <div className={`messenger-main-list-block messenger-main-list-block-${props.sender}`}>
            {
                username &&
                <div className='messenger-main-list-block-username'>{username}</div>
            }
            <div className='messenger-main-list-block-text'>{props.text}</div>
            <div className='messenger-main-list-block-date'>{formatDate(props.date)}</div>
        </div>
    );
}