import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie'
import Auth from './Auth/Auth';
import Main from './Main/Main';
import {useEndpoint} from '../Context/Endpoint';
import {useUserData, useUserDataDispatch} from '../Context/User';
import {updateUserData} from '../Utils/UserData';

import './App.css';

export default function App() {
    const endpoint = useEndpoint();
    const userData = useUserData();
    const userDataDispatch = useUserDataDispatch();
    const [errorText, setErrorText] = useState('');
    const [cookie, setCookie] = useCookies(['uuid']);

    const onSuccessLogin = (data) => {
        userDataDispatch({
            type: 'setData',
            data: data.userData
        });
    }

    const onConnect = ({uuid}) => {
        setCookie('uuid', uuid);
        updateUserData({
            endpoint,
            uuid,
            onSuccess: onSuccessLogin
        });
    }

    const showError = (reason) => {
        setErrorText(reason);
        setTimeout(() => {
            setErrorText('');
        }, 10000);
    }

    const onExit = (reason) => {
        setCookie('uuid', undefined);
        userDataDispatch({type: 'removeData'});
        if (reason) {
            showError(reason);
        }
    }

    useEffect(() => {
        const uuid = cookie.uuid;
        if (uuid) {
            updateUserData({
                endpoint,
                uuid,
                onSuccess: onSuccessLogin
            });
        }
    }, [])

    return (
        <div className='messenger'>
            {
                userData.uuid ?
                    <Main onExit={onExit}/> :
                    <>
                        <Auth onConnect={onConnect}/>
                        {
                            errorText &&
                            <div className='messenger-auth-message-error'>
                                <div className='messenger-auth-message-block'>
                                    {errorText}
                                </div>
                            </div>
                        }
                    </>
            }
        </div>
    )
}