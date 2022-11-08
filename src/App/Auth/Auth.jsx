import {useState} from 'react';
import Button from '../../Components/Button/Button';
import AuthForm from './AuthForm/AuthForm';

import './Auth.css';

Auth.defaultProps = {
    onConnect: () => console.error('Auth component doesn\'t has "onConnect" callback')
}

export default function Auth(props) {
    const [authState, setAuthState] = useState('null');
    const [messageConfig, setMessageConfig] = useState({});


    const onError = (data) => {
        notifyMessage(data.type, data.message);
    };

    const onSuccess = (data) => {
        props.onConnect(data)
    };

    const notifyMessage = (type, text) => {
        setMessageConfig({
            type,
            text
        })
        setTimeout(() => {
            setMessageConfig({});
        }, 3000);
    }

    const getStateRender = (state) => {
        switch (state) {
            case 'signup':
                return getSignUpRender();
            case 'signin':
                return getSignInRender();
            default:
                return getAuthRender();
        }
    }

    const getAuthRender = () => (
        <>
            <div className='messenger-auth-header'>MESSENGER</div>
            <div className='messenger-auth-body'>
                <Button caption='Вход'
                        onClick={() => setAuthState('signin')}/>
                <Button caption='Регистрация'
                        onClick={() => setAuthState('signup')}/>
            </div>
        </>
    )

    const getSignInRender = () => (
        <>
            <div className='messenger-auth-header'>Вход</div>
            <div className='messenger-auth-body'>
                <AuthForm type='signin'
                          endpoint={props.endpoint}
                          onSuccess={onSuccess}
                          onError={onError}
                          onResetType={() => setAuthState('null')}/>
            </div>
        </>
    )

    const getSignUpRender = () => (
        <>
            <div className='messenger-auth-header'>Регистрация</div>
            <div className='messenger-auth-body'>
                <AuthForm type='signup'
                          endpoint={props.endpoint}
                          onSuccess={onSuccess}
                          onError={onError}
                          onResetType={() => setAuthState('null')}/>
            </div>
        </>
    )

    return (
        <div className='messenger-auth'>
            {getStateRender(authState)}
            {
                messageConfig.type &&
                <div className={`messenger-auth-message-${messageConfig.type}`}>{messageConfig.text}</div>
            }
        </div>
    )
}