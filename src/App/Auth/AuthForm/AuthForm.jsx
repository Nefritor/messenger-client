import {useState} from 'react';
import {Cookies} from 'react-cookie';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import {useEndpoint} from '../../../Context/Endpoint';
import {processAuth} from '../../../Utils/Auth';

AuthForm.defaultProps = {
    onSuccess: () => console.error('AuthForm component doesn\'t has "onSuccess" callback'),
    onError: () => console.error('AuthForm component doesn\'t has "onError" callback'),
    onResetType: () => console.error('AuthForm component doesn\'t has "onResetType" callback')
}

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

const getButtonCaption = (type) => {
    switch (type) {
        case 'signin':
            return 'Войти';
        case 'signup':
            return 'Зарегистрироваться';
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

export default function AuthForm({type, onSuccess, onError, onResetType}) {
    const endpoint = useEndpoint();
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
            onError({type: 'error', message: 'Укажите имя пользователя'});
            errorType += 1;
        } else if (!isValidUsername) {
            setIsValidUsername(true);
        }
        if (!password) {
            setIsValidPassword(false);
            setTimeout(() => {
                setIsValidPassword(true);
            }, 3000);
            onError({type: 'error', message: 'Укажите пароль'});
            errorType += 2;
        } else if (!isValidPassword) {
            setIsValidPassword(true);
        }
        if (!!errorType) {
            onError(getErrorByType(errorType));
            return false;
        }
        return true;
    };

    const buttonClick = () => {
        if (validate()) {
            processAuth({
                endpoint,
                type,
                data: getAuthData(type, {username, password}),
                onSuccess,
                onError
            });
        }
    }

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
                       onChange={setUsername}
                       onSubmit={buttonClick}/>
                <Input value={password}
                       placeholder='Пароль'
                       type='password'
                       errorText={!isValidPassword && 'Введите пароль'}
                       onChange={setPassword}
                       onSubmit={buttonClick}/>
            </div>
            <Button caption={getButtonCaption(type)}
                    onClick={buttonClick}/>
            <Button caption='Назад'
                    onClick={onResetType}/>
        </>
    )
}