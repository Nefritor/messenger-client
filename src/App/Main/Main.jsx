import {useEffect, useRef, useState} from 'react';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import MessageBlock from './Block/MessageBlock';
import EventBlock from './Block/EventBlock';

import './Main.css';

const startWebSocket = (wsRef, endpoint, {onMessage, onClose}) => {
    wsRef.current.webSocket = new WebSocket(`ws://${endpoint}/`);
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
                onClose(event.reason);
                break;
            default:
                if (wsRef.current.errorCount >= 3) {
                    onClose('Сервер не отвечает');
                } else {
                    setTimeout(() => {
                        startWebSocket(wsRef, endpoint, {onMessage, onClose});
                    }, 3000);
                }
                break;
        }
    }
}

export default function Main(props) {
    const [messageList, setMessageList] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const wsRef = useRef({
        webSocket: undefined,
        errorCount: 0
    });

    const listEndRef = useRef();

    useEffect(() => {
        startWebSocket(
            wsRef,
            props.endpoint,
            {
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
                    props.onExit(reason);
                }
            });
        return () => {
            onExit();
        }
    }, []);

    useEffect(() => {
        listEndRef.current.scrollIntoView({behavior: "smooth"});
    }, [messageList])

    const onRefInit = (inputRef) => {
        inputRef.current.focus();
    }

    const onExit = () => {
        wsRef.current.webSocket.close(3000);
        props.onExit();
    }

    const sendMessage = () => {
        if (messageInput) {
            wsRef.current.webSocket.send(
                JSON.stringify({
                    type: 'message',
                    data: {
                        uuid: props.userData.uuid,
                        text: messageInput,
                        date: new Date().getTime()
                    }
                })
            );
            setMessageInput('');
        }
    }

    const getBlockProps = (messageProps) => {
        if (messageProps.uuid === props.userData.uuid) {
            return {
                ...messageProps,
                sender: 'me',
                username: props.userData.username
            };
        }
        return {
            ...messageProps,
            sender: 'user'
        };
    }

    return (
        <div className='messenger-main'>
            <div className='messenger-main-user'>
                <span className='messenger-main-user-info'>
                    Пользователь: <span className='messenger-main-user-info-name'>{props.userData.username}</span>
                </span>
                <Button className='messenger-main-user-exit'
                        caption='Выйти'
                        onClick={onExit}/>
            </div>
            <div className='messenger-main-list'>
                {
                    messageList.map((message, index) => (
                        message.text ?
                            <MessageBlock key={index} endpoint={props.endpoint} {...getBlockProps(message)}/> :
                            <EventBlock key={index} endpoint={props.endpoint} {...getBlockProps(message)}/>
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