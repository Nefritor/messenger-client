import {useEffect, useRef, useState} from 'react';
import {Cookies} from 'react-cookie'
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';

import MessageBlock from './Block/MessageBlock';
import EventBlock from './Block/EventBlock';

import {useEndpoint} from '../../Context/Endpoint';
import {useUserData} from '../../Context/User';

import './Main.css';

const startWebSocket = ({wsRef, endpoint, onMessage, onClose}) => {
    wsRef.current.webSocket = new WebSocket(`ws://${endpoint}/${new Cookies().get('uuid')}`);
    wsRef.current.webSocket.onopen = () => {
        wsRef.current.errorCount = 0;
    }
    wsRef.current.webSocket.onmessage = (msg) => {
        onMessage(msg);
    }
    wsRef.current.webSocket.onerror = () => {
        wsRef.current.errorCount++;
    }
    wsRef.current.webSocket.onclose = (event) => {
        switch (event.code) {
            case 3000:
            case 3001:
            case 3002:
                onClose(event.reason);
                break;
            default:
                if (wsRef.current.errorCount >= 3) {
                    onClose('Сервер не отвечает');
                } else {
                    setTimeout(() => {
                        startWebSocket({wsRef, endpoint, onMessage, onClose});
                    }, 3000);
                }
                break;
        }
    }
}

const getSender = (messageProps, currentUUID) => {
    if (messageProps.uuid === currentUUID) {
        return 'me'
    } else {
        switch (messageProps.type) {
            case 1:
                return 'master';
            default:
                return 'user';
        }
    }
}

const getBlockProps = (messageProps, currentUUID) => {
    return {
        ...messageProps,
        sender: getSender(messageProps, currentUUID)
    };
}

export default function Main({onExit}) {
    const endpoint = useEndpoint();
    const userData = useUserData();

    const [messageList, setMessageList] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const wsRef = useRef({
        webSocket: undefined,
        errorCount: 0
    });

    const listEndRef = useRef();

    const onRefInit = (inputRef) => {
        inputRef.current.focus();
    }

    const exit = () => {
        wsRef.current.webSocket.close(3000);
        onExit();
    }

    const sendMessage = () => {
        if (messageInput) {
            wsRef.current.webSocket.send(
                JSON.stringify({
                    type: 'message',
                    data: {
                        uuid: userData.uuid,
                        text: messageInput,
                        date: new Date().getTime()
                    }
                })
            );
            setMessageInput('');
        }
    }

    useEffect(() => {
        startWebSocket({
            wsRef,
            endpoint,
            onMessage: ({data}) => {
                const message = JSON.parse(data);
                switch (message.type) {
                    case 'connection':
                        setMessageList(message.messages);
                        break;
                    case 'message':
                        setMessageList(prev => [...prev, ...message.data]);
                        break;
                }
            },
            onClose: (reason) => {
                onExit(reason);
            }
        });
    }, [endpoint, onExit]);

    useEffect(() => {
        listEndRef.current.scrollIntoView({behavior: "smooth"});
    }, [messageList]);

    return (
        <div className='messenger-main'>
            <div className='messenger-main-user'>
                <span className='messenger-main-user-info'>
                    <span>Пользователь:</span>
                    &nbsp;
                    <span className={
                        'messenger-main-user-info-name'.concat(
                            userData.type === '1' ? ' messenger-main-user-master' : '')
                    }>{userData.username}</span>
                </span>
                <Button className='messenger-main-user-exit'
                        caption='Выйти'
                        onClick={exit}/>
            </div>
            <div className='messenger-main-list'>
                {
                    messageList.map((message, index) => (
                        message.text ?
                            <MessageBlock key={index} {...getBlockProps(message, userData.uuid)}/> :
                            <EventBlock key={index} {...getBlockProps(message, userData.uuid)}/>
                    ))
                }
                <div ref={listEndRef}/>
            </div>
            <div className='messenger-main-input'>
                <Input className='messenger-main-input-wrapper'
                       inputClassName='messenger-main-input-block'
                       value={messageInput}
                       onRefInit={onRefInit}
                       onChange={setMessageInput}
                       onSubmit={sendMessage}/>
                <Button className='messenger-main-input-button'
                        caption='Отправить'
                        onClick={sendMessage}/>
            </div>
        </div>
    );
}