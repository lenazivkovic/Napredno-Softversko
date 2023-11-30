import React, { useEffect, useReducer } from 'react';
import { Card, ListGroup, Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store1 } from '../Store';
import CheckSteps from '../components/CheckSteps.tsx';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import LoadingSign from '../components/LoadingSign';
const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store1);
  const { cart, userInfo } = state;
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.totalPrice = cart.itemsPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREAT_REQUEST' });
      console.log(cart.cartItems, cart.totalPrice);
      const { data } = await axios.post(
        'http://localhost:3000/api/v1/orders/checkout-session',
        {
          orderItems: cart.cartItems,

          // itemsPrice:cart.itemsPrice
          //paymantMehtod:cart.paymentMethod

          ////////////////////////////////////////////srediiiii
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(data.data);
      window.location = data.data.session_url;
      ctxDispatch({ typse: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      //navigate('/order/${data.order._id}');
    } catch (err) {
      const errCode = Number(err.message.split(' ')[5]);

      if (errCode == 400) alert('Proizvod nažalost nije dostupan.');

      dispatch({ type: 'CREAT_FAIL' });
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (!cart.paymentMethod) {
      //navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckSteps step1 step2 step3></CheckSteps>
      <h1 className="my-3">Kupovina</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Informacije</Card.Title>
              <Card.Text className="bg-remove">
                <strong>Ime:</strong>
                {userInfo.data.user.name} <br />
                <strong>Adresa:</strong>
                {userInfo.data.user.address} ,
              </Card.Text>
              <Link to="/user">Edit</Link>
            </Card.Body>
          </Card>

          {/*    <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Placanje</Card.Title>
                    <Card.Text>
                        <strong>Method:</strong>{cart.paymentMethod} <br />
                       
                    </Card.Text>
                    <Link to="/payment">Edit</Link>
                </Card.Body>
            </Card>
 */}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Pregled</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-remove">
                  <Row>
                    <Col>Stavke</Col>
                    <Col>{cart.itemsPrice.toFixed(2)}rsd</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="bg-remove">
                  <Row>
                    <Col>
                      <strong>Ukupno</strong>
                    </Col>
                    <Col>
                      <strong>{cart.totalPrice.toFixed(2)}rsd</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disablerd={cart.cartItems.length === 0}
                    >
                      Kupi
                    </Button>
                  </div>
                  {loading && <LoadingSign></LoadingSign>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col className="pt-5">
          <Card className="mb-3 stavke">
            <Card.Body>
              <Card.Title>Stavke</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((i) => (
                  <ListGroup.Item key={i._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={`http://localhost:3000/${i.image}`}
                          alt={i.name}
                          className="img-fluid rounded img-thumbnail"
                          style={{ width: '100%', 'max-width': '250px' }}
                        ></img>{' '}
                        <Link to={`/product/${i._id}`}>{i.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{i.quantity}</span>
                      </Col>
                      <Col md={3}>{i.price}rsd</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
