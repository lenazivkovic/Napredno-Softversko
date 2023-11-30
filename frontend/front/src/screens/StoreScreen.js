import NavBar from '../Navbar';
import { Store1 } from '../Store';
import React from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Product from '../components/Product';
import logger from 'use-reducer-logger';
import LoadingSign from '../components/LoadingSign';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Form, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Rating from '../components/Raiting';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import NavZaProdavnicu from '../components/NavZaProdavnicu';
import TopCommentBox from '../components/TopCommentBox';
import MessageScroll from '../components/MessageScroll';
import { FloatingLabel } from 'react-bootstrap';
import { ContextProvider } from '../Context';
import { toast } from 'react-toastify';
import SearchBoxZaProizvode from '../components/SearchBoxZaProizvode';
import SearchBoxStore from '../components/SearchBoxStore';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, proizvodi: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'REFRESH_PRODUCT':
      return { ...state, store: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, store: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function StoreScreen() {
  const { state } = useContext(Store1);
  const { userInfo } = state;
  const [store2, setStore] = useState();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [omoguci, setOmoguci] = useState(false);
  const [ocena, setOcena] = useState();
  const [query, setQuery] = useState('all');
  const categories = [];
  //const subcategories = [];
  const formated = {};
  let storeId = '';
  const params = useParams();

  const { id } = params;
  console.log(id);
  const [{ loading, error, proizvodi, loadingCreateReview }, dispatch] =
    useReducer(
      //categories, formated
      logger(reducer),
      {
        proizvodi: [],
        // categories: [],
        // formated: [],
        loading: true,
        error: '',
      }
    );
  let store1;
  useEffect(() => {
    console.log('hej........');
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/api/v1/stores/${id}`
        );

        setStore(result.data.data);
        console.log(store2);
        setOcena(result.data.data.averageRewiev);
      } catch (err) {}
    };
    fetchData();
    // console.log('ovde sam 1');
    // console.log(proizvodi);
    // console.log(proizvodi.length);

    // console.log('ovde sam 2');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log('eo me');
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          // `http://localhost:3000/api/v1/products?id=${id}`
          `http://localhost:3000/api/v1/products/${id}/searchproducts?page=1&pageSize=10&category=all&subcategory=all&price=all&searchQuery=${query}&vegan=all&diabetic=all&vegeterian=all&trudnica=all&lastPiece=all&eco=all&exp=all&faulty=all&fat=all&protein=all&ugljenihidrati=all&order=highest&minRating=all&carbohydrates=all`
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data.products });

        ///  console.log('Rezultat: ' + result.data.data.products);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [query]);

  for (let i = 0; i < proizvodi.length; i++) {
    //console.log('unutra sam');

    storeId = proizvodi[0].store;
    if (!categories.includes(proizvodi[i].category))
      categories.push(proizvodi[i].category);

    const trenutnaKategorija = proizvodi[i].category;

    if (!formated[trenutnaKategorija]) formated[trenutnaKategorija] = [];
    if (!formated[trenutnaKategorija].includes(proizvodi[i].subcategory))
      formated[trenutnaKategorija].push(proizvodi[i].subcategory);

    // console.log(i + 'iteracija');
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Ostavite ocenu');
      return;
    }

    try {
      const { data } = await axios.patch(
        `http://localhost:3000/api/v1/stores/${id}/reviews`,
        {
          review: rating,
          name: userInfo.name,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log('id je ' + id);
      userInfo.data.user.reviewedStores.push(id);
      setStore(data.store);
      console.log(data);
      toast.success('Uspesno ocenjeno!');
      // proizvod.reviews.unshift(data.review);
      // store1.numReviews = data.numReviews;
      // store1.rating = data.rating;
      // dispatch({ type: 'REFRESH_PRODUCT', payload: store1 });
      window.scrollTo({
        behavior: 'smooth',
        //top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      const errCode = Number(error.message.split(' ')[5]);

        if (errCode == 400) {
          toast.error("Već ste uneli ocenu!");
        }
      else
      toast.error(getError());
      dispatch({ type: 'CREATE_FAIL' });
    }
    setOmoguci(true);
    console.log(rating);
  };
  console.log(store2);
  function klikni() {
    navigate(`/searchproduct/${storeId}`);
  }
  console.log(store2);


  return (
    <>
      { formated && categories && (
        <div className="mian">
          <header className="pretraga">
            <div>
              <NavZaProdavnicu
                categories={categories}
                bul={true}
                formated={formated}
                id={id}
              />
            </div>
            <div>
              <SearchBoxZaProizvode storeId={storeId} setujQuery={setQuery} />
            </div>
            <div class="col-12 col-sm-3 col-md-2 d-none d-sm-block">
              <Button
                onClick={klikni}
                className="pretragabtn"
              >
                <i class="fa fa-search-plus" aria-hidden="true"></i> ㅤ Napredna
                pretraga
              </Button>
            </div>
          </header>
          <main>
         
            <div className="naseprodavnice">
              <h1>Proizvodi</h1>
            </div>

            <div className="my-3">
              {/*} <h2>Ocena:{ocena.toFixed(1)}</h2>*/}
              <div className="mb-3">
                {/* < span
>{store1.averageReview}</span>*/}
              </div>
            </div>

            <div className="prodavnice">
              {loading ? (
                <LoadingSign />
              ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
              ) : (
                <Row>
                  {proizvodi.map((product) => (
                    <Col
                      key={product._id}
                      sm={6}
                      md={4}
                      lg={3}
                      className="mb-3"
                    >
                      <Product product={product}></Product>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </main>
        </div>
      )}

      <ContextProvider>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Ostavite ocenu:</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Ocena</Form.Label>
                <Form.Select
                  disabled={userInfo.data.user.reviewedStores.includes(id)}
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
                <Button onClick={submitHandler}>Ok</Button>
              </Form.Group>
            </form>
          ) : (
            <MessageBox>
              Morate da se <Link to={`/login`}>prijavite</Link> da biste
              ostavili ocenu ili komentar
            </MessageBox>
          )}
        </div>
      </ContextProvider>

      <ContextProvider>
        <div className="ColHolder">
          {console.log(storeId)}
          <TopCommentBox autoFocus={false} id={storeId} />
          <MessageScroll />
        </div>
      </ContextProvider>
    </>
  );
}
export default StoreScreen;
