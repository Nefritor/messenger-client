import axios from 'axios';

const processAuth = ({endpoint, type, data, onSuccess, onError}) => {
    axios.post(`http://${endpoint}/${type}`, data)
        .then(({data}) => {
            switch (data.type) {
                case 'success':
                    return onSuccess(data);
                case 'error':
                    return onError(data);
            }
        })
}

export {
    processAuth
}