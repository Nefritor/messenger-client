import {useState} from 'react';
import {Cookies} from 'react-cookie';

import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';

import {useEndpoint} from '../../Context/Endpoint';
import {processAuth} from '../../Utils/Auth';

import SwitchContent from '../../Components/SwitchContent/SwitchContent';

import './Auth.css';

const getAuthData = (type, data) => {
    switch (type) {
        case 'signup':
            return {
                ...data,
                type: new Cookies().get('usertype') || 0
            }
        default:
            return data;
    }
}

const getErrorByType = (type) => {
    const message = (() => {
        switch (type) {
            case 1:
                return 'Укажите имя пользователя';
            case 2:
                return 'Укажите пароль';
            case 3:
                return 'Укажите имя пользователя и пароль';
            default:
                return 'Неизвестная ошибка';
        }
    })();
    return {type: 'error', message};
}

Auth.defaultProps = {
    onConnect: () => console.error('Auth component doesn\'t has "onConnect" callback')
}

export default function Auth({onConnect, onError}) {
    const endpoint = useEndpoint();

    const [authState, setAuthState] = useState(null);

    const [username, setUsername] = useState('');
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(true);

    const validate = () => {
        let errorType = 0;
        if (!username) {
            setIsValidUsername(false);
            setTimeout(() => {
                setIsValidUsername(true);
            }, 3000);
            processError({type: 'error', message: 'Укажите имя пользователя'});
            errorType += 1;
        } else if (!isValidUsername) {
            setIsValidUsername(true);
        }
        if (!password) {
            setIsValidPassword(false);
            setTimeout(() => {
                setIsValidPassword(true);
            }, 3000);
            processError({type: 'error', message: 'Укажите пароль'});
            errorType += 2;
        } else if (!isValidPassword) {
            setIsValidPassword(true);
        }
        if (!!errorType) {
            processError(getErrorByType(errorType));
            return false;
        }
        return true;
    };

    const processError = (data) => {
        onError(data.message, data.type);
    };

    const getSignInRender = () => (
        <AuthForm type='signin'
                  username={username}
                  password={password}
                  onUserNameChanged={setUsername}
                  onPasswordChanged={setPassword}
                  isValidUsername={isValidUsername}
                  isValidPassword={isValidPassword}
                  onSubmit={buttonClick}
                  onResetType={() => setAuthState(null)}/>
    );

    const getSignUpRender = () => (
        <AuthForm type='signup'
                  username={username}
                  password={password}
                  onUserNameChanged={setUsername}
                  onPasswordChanged={setPassword}
                  isValidUsername={isValidUsername}
                  isValidPassword={isValidPassword}
                  onSubmit={buttonClick}
                  onResetType={() => setAuthState(null)}/>
    );

    const getHeaderCaption = (state) => {
        switch (state) {
            case 'signup':
                return 'Регистрация';
            case 'signin':
                return 'Вход';
            default:
                return 'MESSENGER';
        }
    }

    const buttonClick = () => {
        if (validate()) {
            processAuth({
                endpoint,
                type: authState,
                data: getAuthData(authState, {username, password}),
                onSuccess: onConnect,
                onError: processError
            });
        }
    }

    const getButtons = (state) => {
        switch (state) {
            case 'signup':
                return <>
                    <Button caption='Зарегистрироваться'
                            onClick={buttonClick}/>
                    <Button caption='Назад'
                            onClick={() => setAuthState(null)}/>
                </>;
            case 'signin':
                return <>
                    <Button caption='Войти'
                            onClick={buttonClick}/>
                    <Button caption='Назад'
                            onClick={() => setAuthState(null)}/>
                </>;
            default:
                return <>
                    <Button caption='Вход'
                            onClick={() => setAuthState('signin')}/>
                    <Button caption='Регистрация'
                            onClick={() => setAuthState('signup')}/>
                </>;
        }
    }

    const getContentConfig = () => [{
        key: 'signup',
        content: getSignInRender()
    }, {
        key: 'signin',
        content: getSignUpRender()
    }];

    return (
        <div className='messenger-auth'>
            <div className='messenger-auth-header'>{getHeaderCaption(authState)}</div>
            <SwitchContent value={authState} offset={95} configs={getContentConfig()}>
                <div className='messenger-auth-body'>
                    {getButtons(authState)}
                </div>
            </SwitchContent>
        </div>
    )
}

export function AuthForm({
                             username, password, isValidUsername,
                             isValidPassword, onUserNameChanged, onPasswordChanged, onSubmit
                         }) {
    const onRefInit = (inputRef) => {
        inputRef.current.focus();
    }

    return (
        <>
            <div className='messenger-auth-body-form'>
                <Input value={username}
                       placeholder='Имя пользователя'
                       errorText={!isValidUsername && 'Введите имя пользователя'}
                       onRefInit={onRefInit}
                       onChange={onUserNameChanged}
                       onSubmit={onSubmit}/>
                <Input value={password}
                       placeholder='Пароль'
                       type='password'
                       errorText={!isValidPassword && 'Введите пароль'}
                       onChange={onPasswordChanged}
                       onSubmit={onSubmit}/>
            </div>
        </>
    )
}