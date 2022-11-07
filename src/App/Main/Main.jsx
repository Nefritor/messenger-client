import {useEffect, useRef, useState} from 'react';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import MessageBlock from './MessageBlock/MessageBlock';

import './Main.css';

const startWebSocket = ({onMessage, onClose}) => {
    const ws = new WebSocket('ws://localhost:3001/');
    ws.onopen = () => {
        console.log('WebSocket opened on client');
    }
    ws.onmessage = (msg) => {
        console.log(`WebSocket message: ${msg.data}`);
        onMessage(msg);
    }
    ws.onclose = () => {
        onClose();
        ws.close();
    }
    return ws;
}

export default function Main(props) {
    const [messageList, setMessageList] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const webSocket = useRef();

    const listEndRef = useRef();

    useEffect(() => {
        webSocket.current = startWebSocket({
            onMessage: ({data}) => {
                setMessageList(prev => [...prev, ...JSON.parse(data)]);
            },
            onClose: () => {
                props.onExit();
            }
        });
    }, []);

    useEffect(() => {
        listEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messageList])

    const onRefInit = (inputRef) => {
        inputRef.current.focus();
    }

    const sendMessage = () => {
        if (messageInput) {
            webSocket.current.send(
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

    const getMessageBlockProps = (messageProps) => {
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
                        onClick={props.onExit}/>
            </div>
            <div className='messenger-main-list'>
                {
                    messageList.map((message, index) => (
                        <MessageBlock key={index} {...getMessageBlockProps(message)}/>
                    ))
                }
                <div ref={listEndRef} />
            </div>
            <div className='messenger-main-input'>
                <Input className='messenger-main-input-block'
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