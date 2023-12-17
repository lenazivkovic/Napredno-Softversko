import React, { useContext, useState } from "react";

const KomentarContext=React.createContext();

export function useKomentarContext()
{
    return useContext(KomentarContext);
}

export function ContextProvider(props)
{
    //ovo da odredi da li radimo udae ili refresh
    const[messageUpdate,setMessageUpdate]=useState();
    //ovaj boolean da okine referesh
    const [messageReset, setMessageReset]=useState(false);
     //inkrement vrednost
     const[commentIncrement,setMethodIncrement]=useState(10);
    const value={
        messageReset,
        setMessageReset,
        messageUpdate,
        setMessageUpdate,
        commentIncrement,
        setMethodIncrement
    }
   
    return(
        <KomentarContext.Provider value={value}>
            {props.children}
        </KomentarContext.Provider>
    )
}