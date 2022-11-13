import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie'
import Auth from './Auth/Auth';
import Main from './Main/Main';
import {useEndpoint} from '../Context/Endpoint';
import {useUserData, useUserDataDispatch} from '../Context/User';
import {updateUserData} from '../Utils/UserData';

import './App.css';
import Infobox from '../Components/Infobox/Infobox';

export default function App() {
    const endpoint = useEndpoint();
    const userData = useUserData();
    const userDataDispatch = useUserDataDispatch();
    const [errorText, setErrorText] = useState('');
    const [errorType, setErrorType] = useState('error');
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

    const showError = (reason, type = 'error') => {
        setErrorText(reason);
        setErrorType(type);
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
                    <Auth onConnect={onConnect}
                              onError={showError}/>
            }
            <Infobox value={errorText} type={errorType} onValueChanged={setErrorText}/>
        </div>
    )
}