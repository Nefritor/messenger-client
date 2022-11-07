import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie'
import Auth from './Auth/Auth';
import Main from './Main/Main';
import axios from 'axios';

import './App.css';

export default function App(props) {
    const [userData, setUserData] = useState({});
    const [cookie, setCookie] = useCookies(['sid'])

    const updateUserData = (sid) => {
        return axios.post('http://localhost:3001/get-session', {sid}).then(({data}) => {
            switch (data.type) {
                case 'success':
                    const userData = data.userData;
                    return setUserData({
                        uuid: userData.uuid,
                        username: userData.username
                    });
                default:
                    return false;
            }
        })
    }

    const onConnect = ({sid}) => {
        setCookie('sid', sid);
        updateUserData(sid);
    }

    const onExit = () => {
        setCookie('sid', undefined);
        setUserData({});
    }

    useEffect(() => {
        const sid = cookie.sid;
        if (sid) {
            updateUserData(sid);
        }
    }, [])

    return (
        <div className='messenger'>
            {
                userData.uuid ?
                    <Main userData={userData}
                          onExit={onExit}/> :
                    <Auth onConnect={onConnect}/>
            }
        </div>
    )
}