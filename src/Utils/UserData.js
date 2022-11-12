import axios from 'axios';

const updateUserData = ({endpoint, uuid, onSuccess, onError}) => {
    return axios.post(`http://${endpoint}/get-userdata`, {uuid}).then(({data}) => {
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

export {
    updateUserData
}