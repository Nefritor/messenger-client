import {createContext, useContext, useReducer} from 'react';

const UserDataContext = createContext(null);
const UserDataDispatchContext = createContext(null);

export function UserProvider({children}) {
    const [userData, dispatch] = useReducer(userDataReducer, {});
    return (
        <UserDataContext.Provider value={userData}>
            <UserDataDispatchContext.Provider value={dispatch} children={children}/>
        </UserDataContext.Provider>
    )
}

export function useUserData() {
    return useContext(UserDataContext);
}

export function useUserDataDispatch() {
    return useContext(UserDataDispatchContext);
}

function userDataReducer(userData, action) {
    switch (action.type) {
        case 'setData':
            return {
                ...action.data
            };
        case 'removeData':
            return {};
        default:
            throw Error(`Неизвестное действие над данными пользователями: ${action.type}`);
    }
}