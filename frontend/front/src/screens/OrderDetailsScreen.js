import { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import { Store1 } from '../Store';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const OrderDetailsScreen=() =>{
  const params = useParams();
  const { state } = useContext(Store1);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const { id } = params;

  useEffect(() => {
    console.log('ovde sam 111');
    console.log(id);
    const fetchData = async () => {
      console.log('IVANAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      try {
        console.log('USO SAM OVDE');
        console.log(id);
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/orders/oneOrder/${id}`
        );
        console.log('TJTJTJTJTJ');
        console.log(data);
        setOrder(data.data);
      } catch (err) {
        console.log(':(((');
        console.log(err);
      }
    };
    console.log('ovdeeee 22222');
    fetchData();
    console.log('ovdee 333');
  }, []);

  useEffect(() => {
    console.log('ivana');
  }, []);
  console.log('qwerqwer weqrqwe');

  console.log(order);

  const submitHandler = () => {
    navigate(`/admin/orders`);
  };

  return (
    order && (
      <div>
        <h1>Detalji narudzbine</h1>
        <div>
          <Row>
            <Col md={3}>
              <ListGroup variant="flush">
                <h2>{order.code}</h2>

                <table className="table">
                  <thead>
                    <tr>
                      <th>SIFRA</th>
                      <th>ARTIKL</th>
                      <th>KOLICINA</th>
                      <th>CENA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems &&
                      order.orderItems.map((o) => (
                        <tr key={o._id}>
                          <td>{o._id}</td>
                          <td>{o.name}</td>
                          <td>{o.quantity}</td>
                          <td>{o.price}rsd</td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <h3>
                  {' '}
                  Cena:
                  {order.orderItems &&
                    order.orderItems.reduce(
                      (p, c) => p + Number(c.price * c.quantity),
                      0
                    )}{' '}
                  rsd
                </h3>
                <Button onClick={submitHandler}>Nazad</Button>
              </ListGroup>
            </Col>
          </Row>
        </div>
      </div>
    )
  );
}

export default OrderDetailsScreen;
