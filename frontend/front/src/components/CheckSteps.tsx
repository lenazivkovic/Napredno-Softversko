import React from 'react';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

const CheckSteps = (props) => {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
      <Col className={props.step2 ? 'active' : ''}>Kupovina</Col>
      <Col className={props.step3 ? 'active' : ''}>Plaćanje</Col>
    </Row>
  );
};
export default CheckSteps;
