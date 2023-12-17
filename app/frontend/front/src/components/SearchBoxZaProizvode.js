import React, { useState } from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SearchBoxZaProizvode(props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(
      query
        ? `/searchproduct/${props.storeId}/?query=${query}`
        : `/searchproduct/${props.storeId}`
    );
  };
  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
        className='pretraga-p'
          type="text"
          name="q"
          id="q"
          onChange={(e) => {
            setQuery(e.target.value);
            props.setujQuery(e.target.value);
          }}
          placeholder="Pretraga proizvoda..."
          aria-label="Pretraga proizvoda"
          aria-describedby="button-search"
        ></FormControl>
        <Button className="kategorije-menu search-icon" variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
