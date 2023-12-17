import React, { useContext, useEffect, useState } from "react";
import CheckSteps from "../components/CheckSteps";
import { Form } from "react-bootstrap";
import  Button  from "react-bootstrap/Button";
import {Store1} from '../Store';
import { Navigate, useNavigate } from "react-router-dom";



export default function PaymentScreen()
{
    const navigate=useNavigate();
    const{state,dispatch:ctxDispatch}=useContext(Store1);
    const{
        cart:{paymentMethod},


    }=state;
 
    const[paymentMethodName,setPaymentMethod]=useState(
        paymentMethod || 'PayPal'
    );


    const submitHandler=(e)=>{
        e.prevetDefault();
        ctxDispatch({type:'SAVE_PAYMENT_METHOD',payload:paymentMethodName});
        localStorage.setItem('paymentMethod',paymentMethodName);
        navigate('/placeorder');
    }
    return <div>
        <CheckSteps step1 step2 step3></CheckSteps>
        <div className="container small-container">
        
            <h1 className="my-3">Placanje</h1>
            <Form onSubmit={submitHandler}>
                <div className="mb-3">
                    <Form.Check
                    type="radio"
                    id="PayPal"
                    label="PayPal"
                    value="PayPal"
                    checked={paymentMethodName==='PayPal'}
                    onChange={(e)=>setPaymentMethod(e.target.value)} />
                </div>
                <div className="mb-3">
                    <Form.Check
                    type="radio"
                    id="Stripe"
                    label="Stripe"
                    value="Stripe"
                    checked={paymentMethodName==='Stripe'}
                    onChange={(e)=>setPaymentMethod(e.target.value)} />
                </div>
            </Form>
        </div>
    </div>
}