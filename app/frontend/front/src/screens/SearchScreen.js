import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { permittedCrossDomainPolicies } from 'helmet';
import Rating from '../components/Raiting';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import { LinkContainer } from 'react-router-bootstrap';
import LoadingSign from '../components/LoadingSign';
import NavApp from "../components/NavApp";
import Store from '../components/Store';
import Button from 'react-bootstrap/Button';
import SearchBox from '../components/SearchBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        stores: action.payload.stores,
        page: action.payload.page,
        pages: action.payload.pages,
        countStores: action.payload.countStores,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  { name: '0rsd-1000rsd', value: '0-1000' },
  { name: '1000rsd-5000rsd', value: '1000-5000' },
  { name: '5000rsd-10000rsd', value: '5000-10000' },
];

export const ratings = [
  { name: '4starts & up', rating: 4 },
  { name: '3starts & up', rating: 3 },
  { name: '2starts & up', rating: 2 },
  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  console.log(search);
  const sp = new URLSearchParams(search); //search?=category=Shirts

  const category = sp.get('category') || 'all'; //ako je category onda vraca shirts itd
  console.log(category);
  const query = sp.get('query') || 'all';

  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'alphabetical';
  const page = sp.get('page') || 1;

  const [store1, setStore] = useState([]);
  const [pages1, setPages] = useState([]);
  const [page1, setPage] = useState();
  const [countStores1, setCountStores] = useState();
  const [categories, setCategories] = useState([]);
  /*  const [{loading,error,stores,pages,countStores},dispatch]
    =useReducer(reducer,
      {loading:true,
        error:'',
    }); */
  const [{ loading, error, stores, pages, countStores }, dispatch] = useReducer(
    reducer,
    { loading: false, error: '' }
  );
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:3000/api/v1/stores/categories'
        );
        setCategories(data.data);
        //console.log('Kategorije: ', categories);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCategories();
  });

  useEffect(() => {
    const fetchData = async () => {
      //  dispatch({type:'FETCH_REQUEST'});
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/stores/findStores?category=${category}&searchQuery=${query}&minRating=${rating}&order=${order}&page=${page}`
        ); //search za proizvode
        console.log(data);
        console.log(data.data.pages);

        // dispatch({type:'FETCH_SUCCESS',payload:data});
        setStore(data.data.stores);
        setPages(data.data.pages);
        setPage(data.data.page);
        setCountStores(data.data.countStores);
      } catch (err) {
        //dispatch({type:'FETCH_FAIL',payload:getError(err),});
      }
    };
    fetchData();
  }, [category, order, page, query, rating]);

  console.log(store1);

  /* for(let i =0 ;i<stores.length;i++)
  {
    if(!categories.includes(stores[i].category))
    categories.push(stores[i].category);
  }
  */

  const getUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const sort = filter.order || order;

    return `/search?category=${filterCategory}&searchQuery=${filterQuery}&rating=${filterRating}&order=${sort}&page=${filterPage}`;
  };
  function klikni() {
    navigate(`/`);
  }
  return (
    <div>
      {/* <NavApp  categories={categories} bul={true}/> */}
      <header className='pretraga'> 
      <div class="col-sm-1 col-md-1" >
      <Button className="pretragabtn" onClick={klikni}>Nazad</Button>
      </div>
      <div class="col-sm-11 col-md-11">
      <SearchBox />
      </div>
      <title>Pretraga</title>
      </header>
      <Row className="prikaz-proizvoda">
        <Col md={3}>
          <h3 className="kategorija">Odeljak</h3>
          <div>
            <ul>
              <li className='proizvod'>
                <Link
                  className={'all' === category ? 'text-bold zvezdice' : ''}
                  to={getUrl({ category: 'all', rating: 'all' })} // ,rating:'all'
                  style={{ color: 'black', textDecoration: 'inherit'}}
                >
                  Sve
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c} className='proizvod'>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getUrl({ category: c })}
                    style={{ color: 'black', textDecoration: 'inherit'}}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
                <hr/>
          <div>
            <h3 className="kategorija">Ocena</h3>
            <ul>
              {ratings.map((p) => (
                <li key={p.name}>
                  <Link
                    to={getUrl({ rating: p.rating })}
                    className={
                      `${p.rating}` === `${rating}` ? 'text-bold zvezdice' : ''
                    }
                    style={{ color: 'white', textDecoration: 'inherit'}}
                  >
                    <Rating caption={' i više'} rating={p.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold zvezdice' : ''}
                  style={{ color: 'white', textDecoration: 'inherit'}}
                >
                  <Rating caption={'i više'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingSign></LoadingSign>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {console.log('eheej')}
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div className="result-p"> 
                    {countStores === 0 ? 'No' : countStores} Rezultati pretrage
                    {query !== 'all' && ':' + query}
                    {category !== 'all' && ':' + category}
                    {rating !== 'all' && ': Ocena' + rating + '& up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="div-sortiranje text-end">
                  Sortiraj{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="alphabetical">Abeceda</option>
                    <option value="lowest">Ocena: Rastuce</option>
                    <option value="highest">Ocena: Opadajuce</option>
                  </select>
                </Col>
              </Row>
              {store1.length === 0 && (
                <MessageBox> Nema prodavnica sa tim kriterijumima</MessageBox>
              )}
              <Row>
                {store1.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Store store={product}></Store>
                    {console.log(product)}
                  </Col>
                ))}
              </Row>
              <div>
                {console.log('ejejejejejjeje' + pages)}
                {[...Array(pages1).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
/*import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Raiting from '../components/Raiting';
import Store from '../components/Store';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Product from '../components/Product';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import LoadingSign from '../components/LoadingSign';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        stores: action.payload.stores,
        page: action.payload.page,
        pages: action.payload.pages,
        countStores: action.payload.countStores,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, stores, pages, countStores }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          ` http://localhost:3000/api/v1/stores/findStores?category=${category}&searchQuery=${query}&minRating=${rating}&order=${order}&page=${page}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        console.log(data);
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  /* useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]); 

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <title>Search Products</title>

      <Row>
        <Col md={3}>
          <h3>Department</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-bold' : ''}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                  >
                    <Raiting caption={' & up'} rating={r.rating}></Raiting>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Raiting caption={' & up'} rating={0}></Raiting>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingSign></LoadingSign>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countStores === 0 ? 'No' : countStores} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {stores.length === 0 && <MessageBox>No Product Found</MessageBox>}

              <Row>
                {stores.map((p) => (
                  <Col sm={6} lg={4} className="mb-3" key={p._id}>
                    <Store store={p}></Store>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}*/
