import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie'
import Auth from './Auth/Auth';
import Main from './Main/Main';
import axios from 'axios';

import './App.css';

App.defaultProps = {
    endpoint: 'api.nefritor.ru'
}

export default function App(props) {
    const [errorText, setErrorText] = useState('');
    const [userData, setUserData] = useState({});
    const [cookie, setCookie] = useCookies(['uuid'])

    const updateUserData = (uuid) => {
        return axios.post(`http://${props.endpoint}/get-userdata`, {uuid}).then(({data}) => {
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

    const onConnect = ({uuid}) => {
        setCookie('uuid', uuid);
        updateUserData(uuid);
    }

    const showError = (reason) => {
        setErrorText(reason);
        setTimeout(() => {
            setErrorText('');
        }, 10000);
    }

    const onExit = (reason) => {
        setCookie('uuid', undefined);
        setUserData({});
        if (reason) {
            showError(reason);
        }
    }

    useEffect(() => {
        const uuid = cookie.uuid;
        if (uuid) {
            updateUserData(uuid);
        }
    }, [])

    return (
        <div className='messenger'>
            {
                userData.uuid ?
                    <Main endpoint={props.endpoint}
                          userData={userData}
                          onExit={onExit}/> :
                    <>
                        <Auth endpoint={props.endpoint}
                              onConnect={onConnect}/>
                        {
                            errorText &&
                            <div className='messenger-auth-message-error'>{errorText}</div>
                        }
                    </>
            }
        </div>
    )
}