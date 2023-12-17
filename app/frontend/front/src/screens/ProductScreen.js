import React, { useContext } from 'react';
import { useEffect, useReducer, useRef, useState } from 'react';
import logger from 'use-reducer-logger';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ListGroup, ListGroupItem, Row, Badge, Button } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import '../App.css';
import LoadingSign from '../components/LoadingSign';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store1 } from '../Store';
import Rating from '../components/Raiting';
import { FloatingLabel } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false, proizvod: action.payload };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, proizvod: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  // const [comment,setComment]=useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { name } = params;
  const [omoguci, setOmoguci] = useState(false);
  const { state, dispatch: cxtDispatch } = useContext(Store1);
  const { cart, userInfo } = state;
  console.log(`${name}`);

  const [{ loading, error, proizvod, loadingCreateReview }, dispatch] =
    useReducer(logger(reducer), {
      proizvod: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `http://localhost:3000/api/v1/products/${name}`,
          userInfo?.token ? {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        : {}
        );
        console.log(result);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [name]);


  const addToCartHandler = async () => {
    const postoji = cart.cartItems.find((x) => x.id === proizvod._id);
    const quantity = postoji ? postoji.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/products/${name}`
    );
    if (data.countInStock < quantity) {
      window.alert('Proizvod je nedostupan');
      return;
    }
    cxtDispatch({ type: 'CART_ADD_ITEM', payload: { ...proizvod, quantity } });
    //navigate('/cart');
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Unesite ocenu!!');
      return;
    }
    try {
      console.log(rating);
      const { data } = await axios.patch(
        `http://localhost:3000/api/v1/products/${name}/reviews`,
        {
          rating,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
        payload: data.data,
      });
      toast.success('Uspesno uneta ocena');
      userInfo.data.user.reviewedProducts.push(name);

      dispatch({ type: 'REFRESH_PRODUCT', payload: proizvod });
      window.scrollTo({
        behavior: 'smooth',
        //top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      const errCode = Number(error.message.split(' ')[5]);

      if (errCode == 400) {
        toast.error('Već ste uneli ocenu!');
      }

      dispatch({ type: 'CREATE_FAIL' });
    }
    setOmoguci(true);
  };
  return loading ? (
    <LoadingSign />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={`http://localhost:3000/${proizvod.image}`}
            //src={selectedImage || proizvod.image}
            alt={proizvod.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
            <h1 className='naziv-proizvoda'>{proizvod.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item className="ocene-proizvoda">
              <Rating
                rating={proizvod.rating}
                numReviews={proizvod.numReviews}
                caption={
                  proizvod.numReviews ? proizvod.numReviews : 'Nema ocena'
                }
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item className="cena"> Cena:<br /> <span className="vrednost-cene">{proizvod.price}RSD</span></ListGroup.Item>
            {/*  <ListGroup.Item>
               <Row xs={1} md={2} className="g-2">
               {
                  [proizvod.image, ...proizvod.images].map((x)=>(
                    <Col key={x}>
                      <Card>
                        <Button className="thumbnail" type="button" variant="light" onClick={()=>setSelectedImage(x)}>
                          <Card.Img variant="top" src={x} alt={product} ></Card.Img>
                        </Button>
                      </Card>
                    </Col>

                  ))
               }
               </Row>
               </ListGroup.Item>  */}
            <ListGroup.Item>
              {' '}
              <p>Opis: {proizvod.description} </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  {proizvod.diabetic && <Badge bg="danger">Diabetic</Badge>}

                  {proizvod.vegan && <Badge bg="danger">Vegan</Badge>}
                  {proizvod.vegeterian && (
                    <Badge bg="danger">Vegaeterian</Badge>
                  )}
                  {proizvod.expirationDate && (
                    <Badge bg="danger">
                      Najbolje upotrebiti do:{' '}
                      {proizvod.expirationDate.split('T')[0]}
                    </Badge>
                  )}

                  {/*   {proizvod.category === 'Hrana' ||
                    proizvod.category === 'Pice' ||


                    (proizvod.category === 'Namirnice' && proizvod.diabetic && (
                      <Badge bg="danger">Diabetic</Badge>
                    )) ||
                    (!proizvod.vegan && <Badge bg="danger">Vegan</Badge>) ||
                    (proizvod.vegeterian && (
                      <Badge bg="danger">Vegaeterian</Badge>
                    )) ||
                    (proizvod.expirationDate  && (
                      <Badge bg="danger">Istice rok</Badge>
                    ))}

                  {proizvod.category === 'Garderoba' ||
                    proizvod.category === 'Higijena' ||
                    (proizvod.category === 'Ostalo' && proizvod.diabetic && (
                      <Badge bg="danger">Diabetic</Badge>
                    )) ||
                    (proizvod.vegan && <Badge bg="danger">Vegan</Badge>) ||
                    (proizvod.vegeterian && (
                      <Badge bg="danger">Vegaeterian</Badge>
                    )) ||
                    (proizvod.expirationDate == 'true' && (
                      <Badge bg="danger">Istice rok</Badge>
                    ))} */}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="dostupnost">
                <Row>
                  <Col>
                    {proizvod.countInStock > 0 ? (
                      <Badge bg="success">Dostupno</Badge>
                    ) : (
                      <Badge bg="danger">Nedostupno</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              {proizvod.countInStock > 0 && (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button className="dodajuKorpu" onClick={addToCartHandler} variant="primary">
                      Dodaj u korpu
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
          </ListGroup>
        </Col>
        <Col md={3}></Col>
        
       {/* <Card>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Cena:</Col>
                  <Col>{proizvod.price}rsd</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {proizvod.countInStock > 0 ? (
                      <Badge bg="success">Dostupno</Badge>
                    ) : (
                      <Badge bg="danger">Nedostupno</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              {proizvod.countInStock > 0 && (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button onClick={addToCartHandler} variant="primary">
                      Dodaj u korpu
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card> */}
      </Row>
      <div className="my-3">
        {/*<h2 ref={reviewsRef}>Reviews</h2>*/}
        <div className="mb-3">
          {/*  {proizvod.reviews.length === 0 && (
            <MessageBox>There is no review</MessageBox>
          )} */}
        </div>
        <ListGroup>
          {/*  {proizvod.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))} */}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Ostavite ocenu:</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Ocena</Form.Label>
                <Form.Select
                  disabled={userInfo.data.user.reviewedProducts.includes(name)}
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Izaberite ocenu...</option>
                  <option value="1">1- Vrlo lose </option>
                  <option value="2">2- Lose</option>
                  <option value="3">3- Dobro</option>
                  <option value="4">4- Vrlo dobro</option>
                  <option value="5">5- Odlicno</option>
                </Form.Select>
              </Form.Group>
              <Button onClick={submitHandler}>Ok</Button>
              {/*  <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
               //  value={comment}
                // onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel> 

              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Submit
                </Button>
                {loadingCreateReview && <LoadingSign></LoadingSign>}
              </div>*/}
            </form>
          ) : (
            <MessageBox>
              Morate da se <Link to={`/login`}>ulogujete</Link> da biste uneli
              ocenu
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;
