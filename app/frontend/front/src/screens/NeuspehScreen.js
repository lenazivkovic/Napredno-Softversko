import axios from "axios";
import React, { useState,useContext, useReducer } from "react";
import { Form } from "react-bootstrap";
import { Store1 } from "../Store";
import { getError } from "../utils";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MessageBox from "../components/MessageBox";
const reducer=(state,action)=>{
    switch(action.type)
    {
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true ,successDelete:false};
          case 'DELETE_SUCCESS':
            return {
              ...state,
              loadingDelete: false,
              successDelete: true,
            };
          case 'DELETE_FAIL':
            return { ...state, loadingDelete: false ,successDelete:false};
          case 'DELETE_RESET':
            return { ...state, loadingDelete: false,successDelete:false };
          default:
            return state;
    }
  };
  
//{{URL}}/api/v1/orders/canceled-order/628e6f46aebd2d8203d70994

export default function NeuspehScreen()
{
    const {state}=useContext(Store1);
    const {userInfo}=state;
    console.log(state);

    const {search} = useLocation();
    console.log(search);
    const sp = new URLSearchParams(search); // /search?category=Shirts
  
    const id = sp.get('id') || 0;
    console.log(id);
    const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
    useEffect(() => {
        const fetchData = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.delete(`http://localhost:3000/api/v1/orders/canceled-order/${id}`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'FETCH_SUCCESS', payload: data });

          } catch (err) {
            dispatch({
              type: 'FETCH_FAIL',
              payload: getError(err),
            });
          }
        };
        if (successDelete) {
          dispatch({ type: 'DELETE_RESET' });
         toast.success("bravo ti ga bate!!");
        } else {
          fetchData();
        }
      }, [userInfo, successDelete]);

     return(
      <div>
          <MessageBox>Odustali ste od placanja. <Link to="/">Idi u kupovinu!</Link></MessageBox>
       
      </div>

     );

}