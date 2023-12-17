import React, { useState } from "react";
import { Button, Form, FormControl,  InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SearchBoxZaOrderList({query}){
    const navigate=useNavigate();
   
    const submitHandler=(e)=>{
        e.preventDefault();
       // navigate(query? `/store/?query=${query}`:'/store');
      //navigate(query? `/search/?query=${query}`:'/search');
    };
    return(
        <Form className="d-flex me-auto" onSubmit={submitHandler}>
            <InputGroup>
            <FormControl
            type="text"
            name="q"
            id="q"
            onChange={(e)=>query(e.target.value)}
            placeholder="Pretraga narudzbina..."
            aria-label="Pretraga narudzbina"
            aria-describedby="button-search">

            </FormControl>
           
            </InputGroup>
            </Form>

            
    );
}