import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import {Button} from "react-bootstrap";
import { toast } from "react-toastify";
import { getError } from "../utils";
export default function InputMailScreen()
{
    const[email,setEmail]=useState('');
    const submitHandler=async(i) =>
    {
        i.preventDefault();
        try{
            const {data}= await axios.post('http://localhost:3000/api/v1/users/forgotPassword',
            {
                email,
               
            });
           /*  console.log(data.user);
            ctxDispatch({type:'USER_LOGIN',payload:data});
            localStorage.setItem('userInfo',JSON.stringify(data));//pretvara se 8u string jer podaci u lacalstorage treba da budu stringovi
          navigate(redirect || '/'); */
            //////ovde neki alert
            window.alert('Poslali smo Vam mail za resetovanje šifre, ukoliko niste dobili mail ponovo kliknite na dugme "OK"');
        }catch(err){
            toast.error(getError(err));
           alert("Neispravan mail ili lozinka!");
           return;
        }
      

    }
 return(
    <Form onSubmit={submitHandler}>
    <Form.Group className="mb-3" controlId="email">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" required onChange={(e)=>setEmail(e.target.value)}/>
</Form.Group>
<Button type="submit">Ok</Button>
</Form>
 
 );
}