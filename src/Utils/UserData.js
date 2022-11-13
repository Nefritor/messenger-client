import axios from 'axios';

const updateUserData = ({endpoint, uuid, onSuccess, onError}) => {
    axios.post(`http://${endpoint}/get-userdata`, {uuid}).then(({data}) => {
        switch (data.type) {
            case 'success':
                if (onSuccess) {
                    onSuccess(data);
                }
                break;
        }
    }).catch((err) => {
        if (onError) {
            onError(err);
        }
    })
}

const getUsersList = ({endpoint, onSuccess, onError}) => {
    axios.get(`http://${endpoint}/get-users`).then(({data}) => {
        if (onSuccess) {
            onSuccess(data);
        }
    }).catch((err) => {
        if (onError) {
            onError(err);
        }
    })
}

export {
    updateUserData,
    getUsersList
}