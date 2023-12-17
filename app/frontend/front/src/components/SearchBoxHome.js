import React, { useState } from "react";
import { Button, Form, FormControl,  InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SearchBoxHome({query}){
    const navigate=useNavigate();
  

    const submitHandler=(e)=>{
        e.preventDefault();
     
    };

    return(
        <Form className="d-flex me-auto" onSubmit={submitHandler}>
            <InputGroup>
            <FormControl
           className="pretraga-p"
           type="text"
            name="q"
            id="q"
            onChange={(e)=>query(e.target.value)}
            placeholder="Pretraga prodavnica..."
            aria-label="Pretraga prodavnica"
            aria-describedby="button-search">

            </FormControl>
            
            </InputGroup>
            </Form>

            
    );
}