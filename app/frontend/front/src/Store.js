
import {createContext,useReducer} from 'react';

export const Store1= createContext();
const initialState={
    
    
        userInfo: localStorage.getItem('userInfo')  //ako cartItems postoji u lcoalstorage onda koristi njega, ako ne prazan niz
        ? JSON.parse(localStorage.getItem('userInfo')): null //iz stringa u js objekat
        ,
    sotre:localStorage.getItem('store')  //ako cartItems postoji u lcoalstorage onda koristi njega, ako ne prazan niz
    ? JSON.parse(localStorage.getItem('store')): null ,
        
    cart:{
        cartItems: localStorage.getItem('cartItems')  //ako cartItems postoji u lcoalstorage onda koristi njega, ako ne prazan niz
        ? JSON.parse(localStorage.getItem('cartItems')): []
        ,
      /*   paymentMethod: localStorage.getItem('paymentMethod')  //ako cartItems postoji u lcoalstorage onda koristi njega, ako ne prazan niz
        ? JSON.parse(localStorage.getItem('paymentMethod')): ''
        , */
    },
};
function reducer(state,action)
{
    switch(action.type)
    {
        case 'CART_ADD_ITEM':{//dodavanje u korpu + provera da ne dodajemo duplikate


        const novi=action.payload;

        const postojeci=state.cart.cartItems.find( //ako je postojeci=null onda znaci da imamo voi proizvod
            (i)=>i._id===novi._id);

        const cartItems= postojeci ? state.cart.cartItems.map((i)=>
        i._id === postojeci._id ? novi : i)
            : [...state.cart.cartItems,novi];
            localStorage.setItem('cartItems',JSON.stringify(cartItems));//da se ne bi brisala korpa prilikom refresha,cartItems se konvertuje u string i upisuje u cartItems
            return{...state,cart:{...state.cart,cartItems}};
        }
            case 'CART_REMOVE_ITEM':   {
                const cartItems=state.cart.cartItems.filter(
                (i)=>i._id !== action.payload._id);
                localStorage.setItem('cartItems',JSON.stringify(cartItems));
                return {...state,cart:{...state.cart,cartItems}};
            }
            case 'CART_CLEAR':
                return{...state,cart:{...state.cart,cartItems:[]}};
            case 'USER_LOGIN':   {
               
                return {...state,userInfo:action.payload};//zadrzi prethodno stanje i update-uj sa userinfo
            }
            case 'USER_LOGOUT':   {
               
                return {...state,userInfo:null,cart:{cartItems:[]}//,paymentMethod=''};//zadrzi prethodno stanje i update-uj sa userinfo
            }
        }
          /*   case 'SAVE_PAYMENT_METHOD':   {
                
                return {...state,cart:{...state.cart,paymentMethod: action.payload}},
            }; */
        default:
            return state;
    }
}
export function StoreProvider(props) {

    const [state,dispatch]=useReducer(reducer,initialState);
    const value={state,dispatch};
    return <Store1.Provider value={value}>{props.children}</Store1.Provider>
}

