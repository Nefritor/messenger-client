import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import {useState} from 'react';
import axios from 'axios';

AuthForm.defaultProps = {
    onSuccess: () => console.error('AuthForm component doesn\'t has "onSuccess" callback'),
    onError: () => console.error('AuthForm component doesn\'t has "onError" callback'),
    onResetType: () => console.error('AuthForm component doesn\'t has "onResetType" callback')
}

export default function AuthForm(props) {
    const [username, setUsername] = useState('');
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(true);

    const processAuth = (type) => {
        axios.post(`http://${props.endpoint}/${type}`, {username, password})
            .then(({data}) => {
                switch (data.type) {
                    case 'success':
                        return props.onSuccess(data);
                    case 'error':
                        return props.onError(data);
                }
            })
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

    const validate = () => {
        let errorType = 0;
        if (!username) {
            setIsValidUsername(false);
            setTimeout(() => {
                setIsValidUsername(true);
            }, 3000);
            props.onError({type: 'error', message: 'Укажите имя пользователя'});
            errorType += 1;
        } else if (!isValidUsername) {
            setIsValidUsername(true);
        }
        if (!password) {
            setIsValidPassword(false);
            setTimeout(() => {
                setIsValidPassword(true);
            }, 3000);
            props.onError({type: 'error', message: 'Укажите пароль'});
            errorType += 2;
        } else if (!isValidPassword) {
            setIsValidPassword(true);
        }
        if (!!errorType) {
            props.onError(getErrorByType(errorType));
            return false;
        }
        return true;
    }

    const getButtonCaption = () => {
        switch (props.type) {
            case 'signin':
                return 'Войти';
            case 'signup':
                return 'Зарегистрироваться';
        }
    }

    const buttonClick = () => {
        if (validate()) {
            processAuth(props.type);
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
            <Button caption={getButtonCaption()}
                    onClick={buttonClick}/>
            <Button caption='Назад'
                    onClick={props.onResetType}/>
        </>
    )
}