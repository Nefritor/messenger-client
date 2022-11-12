import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import {EndpointProvider} from './Context/Endpoint';
import {UserProvider} from './Context/User';
import App from './App/App';

import './index.css';

const ENDPOINTS = {
    REMOTE: 'api.nefritor.ru',
    LOCAL: 'localhost:3001'
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <EndpointProvider endpoint={ENDPOINTS.LOCAL}>
        <UserProvider>
            <App/>
        </UserProvider>
    </EndpointProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
