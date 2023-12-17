
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import {Button} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils";
export default function InputSifraScreen()
{
    const params =useParams();
    console.log(params);
    const {id}=params;
   const navigate=useNavigate();
    const[password,setPassword]=useState('');
    const[passwordConfirmed,setpasswordConfirmed]=useState('');
    const submitHandler=async(i) =>
    {
        i.preventDefault();
        try{
            const {data}= await axios.patch(`http://localhost:3000/api/v1/users/resetPassword/${id}`,
            {
                password,
                passwordConfirm:passwordConfirmed
               
            });
        toast.success('Uspešno resetovana šifra');
          navigate(`/login`);
        }catch(err){
            toast.error(getError(err));
           alert("Neispravna lozinka!");//isteko ili neispravan token
           return;
        }
      

    }
    return(
        <Form onSubmit={submitHandler}>
         <Form.Group className="mb-3" controlId="password">
          <Form.Label>Nova lozinka</Form.Label>
          <Form.Control
          type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="passwordConfirm">
          <Form.Label>Potvrdi novu lozinku</Form.Label>
          <Form.Control
          type="password"
            value={passwordConfirmed}
            onChange={(e) => setpasswordConfirmed(e.target.value)}
            required
          />
        </Form.Group>
        <Button onClick={submitHandler}>Promeni Lozinku</Button>
    </Form>
     
     );
}