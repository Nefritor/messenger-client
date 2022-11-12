import {createContext, useContext} from 'react';

const EndpointContext = createContext(null);

export function EndpointProvider({children, endpoint}) {
    return (
        <EndpointContext.Provider value={endpoint} children={children}/>
    )
}

export function useEndpoint() {
    return useContext(EndpointContext);
}