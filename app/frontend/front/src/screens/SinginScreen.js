import  Button  from 'react-bootstrap/Button';
import { Container,Form } from "react-bootstrap";
import {Link, useLocation ,useNavigate} from 'react-router-dom';
import {useState,useContext, useEffect} from 'react';
import {Store1} from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SigninScreen()
{   const navigate=useNavigate();
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [name,setName]=useState('');
    const [passwordConfirm,setpasswordConfirm]=useState('');
    const [address,setaddress]=useState('');
    


    const {search}=useLocation();
    const redirectURL= new URLSearchParams(search).get('redirect');
    const redirect=redirectURL? redirectURL:'/';


    const {state,dispatch:ctxDispatch}=useContext(Store1);
    const {userInfo}=state;


    const submitHandler=async(i) =>
    {
        i.preventDefault();
       
        try{
            const {data}= await axios.post('http://localhost:3000/api/v1/users/signup',{
                name,
                email,
                password,
                passwordConfirm,
                address,

            });
           
            ctxDispatch({type:'USER_LOGIN',payload:data})
            localStorage.setItem('userInfo',JSON.stringify(data));//pretvara se 8u string jer podaci u lacalstorage treba da budu stringovi
          navigate(redirect || '/');
            console.log(data);
        }catch(err){
           // toast.error(getEror(err)); qwerty123
           alert("Neispravan mail ili lozinka!");
           return;
        }
      

    }

useEffect(()=>{
    if(userInfo)
    {
        navigate(redirect); ///da ne mozes ulogovan da ides opet na signin screen

    }

},[navigate,redirect,userInfo]);



    return (
        <Container className="small-container">
            <h1>Sign In</h1>
            <Form onSubmit={submitHandler}>

            <Form.Group className="mb-3" controlId="name">
            <Form.Label>Ime</Form.Label>
            <Form.Control  required onChange={(e)=>setName(e.target.value)}/>
      </Form.Group>

        <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required onChange={(e)=>setEmail(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
            <Form.Label>Šifra</Form.Label>
            <Form.Control type="password" required onChange={(p)=>setPassword(p.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
            <Form.Label>Potvrdite šifru</Form.Label>
            <Form.Control type="password" required onChange={(p)=>setpasswordConfirm(p.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="address">
            <Form.Label>Adresa</Form.Label>
            <Form.Control  required onChange={(e)=>setaddress(e.target.value)}/>
      </Form.Group>

      <div className="mb-3">
          <Button type="submit">Sign In</Button>
      </div>
      <div className='mb-3'>
         Već imate nalog?{' '}
          <Link to={`/login?redirect=${redirect}`}>Log in</Link>
      </div>
            </Form>
        </Container>
    )
}