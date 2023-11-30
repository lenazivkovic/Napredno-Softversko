import React, { useState } from "react";
import { Button, Form, FormControl,  InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SearchBox(){
    const navigate=useNavigate();
    const[query,setQuery]=useState('');
    const submitHandler=(e)=>{
        e.preventDefault();
       // navigate(query? `/?query=${query}`:'/');
      navigate(query? `/search/?query=${query}`:'/search');
    };
    return(
        <Form className="d-flex me-auto" onSubmit={submitHandler}>
            <InputGroup>
            <FormControl
            className="pretraga-p"
            type="text"
            name="q"
            id="q"
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Pretraga prodavnica..."
            aria-label="Pretraga prodavnica"
            aria-describedby="button-search">

            </FormControl>
            <Button className="kategorije-menu search-icon" variant="outline-primary" type="submit" id="button-search">
                <i className="fas fa-search"></i>
            </Button>
            </InputGroup>
            </Form>

            
    );
}