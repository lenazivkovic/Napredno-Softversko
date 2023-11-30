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
import { toast, ToastContainer } from 'react-toastify';
//import "react-toastify/dist/ReactTostify.css";
//import "react-toastify/ReactTostify.min.css";
//import 'react-toastify/dist/ReactToastify.css';

import { Link } from 'react-router-dom';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import SearchBoxZaProizvode from '../components/SearchBoxZaProizvode';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        proizvodi: action.payload,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const proteins = [
  {
    name: 'Sve',
    value: 'all',
  },
  {
    name: '<5g',
    value: '0-5',
  },
  {
    name: '5g do 15g',
    value: '6-15',
  },
  {
    name: '>15g',
    value: '15-1000',
  },
];
const fats = [
  {
    name: 'Sve',
    value: 'all',
  },
  {
    name: '<5g',
    value: '0-5',
  },
  {
    name: '5g do 15g',
    value: '6-15',
  },
  {
    name: '>15g',
    value: '15-1000',
  },
];
const ugljenihidratis = [
  {
    name: 'Sve',
    value: 'all',
  },
  {
    name: '<10g',
    value: '0-10',
  },
  {
    name: '10g do 35g',
    value: '10-35',
  },
  {
    name: '>35g',
    value: '35-1000',
  },
];

const prices = [
  {
    name: '1rsd to 50rsd',
    value: '1-50',
  },
  {
    name: '51rsd to 200rsd',
    value: '51-200',
  },
  {
    name: '201rsd to 1000rsd',
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

function SearchProductsScreen() {
  const params = useParams();
  const { id } = params;
  console.log(id);
  const { state } = useContext(Store1);
  const { userInfo } = state;
  const navigate = useNavigate();
  const searchproduct = useLocation();
  console.log(searchproduct);
  const sp = new URLSearchParams(searchproduct.search); // /search?category=Shirts

  const category = sp.get('category') || 'all';
  console.log(sp.get('category'));
  const identifikator = sp.get('identifikator');

  console.log(identifikator);
  const searchQuery = sp.get('query') || 'all';
  const subcategory = sp.get('subcategory') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;
  const pageSize = sp.get('pageSize') || 10;
  const fat = sp.get('fat') || 'all';
  const protein = sp.get('protein') || 'all';
  const ugljenihidrati = sp.get('ugljenihidrati') || 'all';
  const diabetic = sp.get('diabetic') || 'all';
  const vegan = sp.get('vegan') || 'all';
  const vegeterian = sp.get('vegeterian') || 'all';
  const trudnica = sp.get('trudnica') || 'all';
  const lastpiece = sp.get('lastpiece') || 'all';
  const eco = sp.get('eco') || 'all';
  const exp = sp.get('exp') || 'all';
  const feler = sp.get('feler') || 'all';
  const [store, setStore] = useState([]);
  const [prvi, setPrvi] = useState(true);
  const [drugi, setDrugi] = useState(true);
  const [postavljen, setPostavljen] = useState(1);
  const [{ loading, error, proizvodi, pages, countProducts }, dispatch] =
    useReducer(logger(reducer), {
      proizvodi: [],
      loading: true,

      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `http://localhost:3000/api/v1/products/${id}/searchproducts?page=${page}&minRating=${rating}&pageSize=${pageSize}&category=${category}&subcategory=${subcategory}&price=${price}&searchQuery=${searchQuery}&vegan=${vegan}&diabetic=${diabetic}&vegeterian=${vegeterian}&trudnica=${trudnica}&lastPiece=${lastpiece}&eco=${eco}&exp=${exp}&faulty=${feler}&fat=${fat}&protein=${protein}&ugljenihidrati=${ugljenihidrati}&order=${order}`
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data.products });

        console.log('ehej');
        console.log(result.data.data.products);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [
    category,
    order,
    page,
    rating,
    subcategory,
    diabetic,
    vegan,
    vegeterian,
    price,
    searchQuery,
    trudnica,
    lastpiece,
    eco,
    exp,
    feler,
    fat,
    protein,
    ugljenihidrati,
  ]);

  //{{URL}}/api/v1/stores/categoriesAndSubcategories/Galija
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/stores/categoriesAndSubcategories/${id}`
        );
        setCategories(data.data.categories);
      } catch (err) {
        //  toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);
  console.log(categories);
  const [subcategories, setSubcategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/stores/categoriesAndSubcategories/${id}`
        );
        setSubcategories(data.data.subcategories);
      } catch (err) {
        //  toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);
  console.log(subcategories);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterPageSize = filter.pageSize || pageSize;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || searchQuery;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const filterProtein = filter.protein || protein;
    const filterFat = filter.fat || fat;
    const filterUgljenihidrati = filter.ugljenihidrati || ugljenihidrati;
    const filterDiabetic = filter.diabetic || diabetic;
    const filterVegan = filter.vegan || vegan;
    const filterVegeterian = filter.vegeterian || vegeterian;
    const filterTrudnica = filter.trudnica || trudnica;
    const filterSubcategory = filter.subcategory || subcategory;
    const sortOrder = filter.order || order;
    const filerlastpiece = filter.lastpiece || lastpiece;
    const filereco = filter.eco || eco;
    const filerexp = filter.exp || exp;
    const filerfeler = filter.feler || feler;
    return `/searchproduct/${id}?category=${filterCategory}&feler=${filerfeler}&lastPiece=${filerlastpiece}&eco=${filereco}&exp=${filerexp}&trudnica=${filterTrudnica}&vegeterian=${filterVegeterian}&vegan=${filterVegan}&diabetic=${filterDiabetic}&ugljenihidrati=${filterUgljenihidrati}&fat=${filterFat}&protein=${filterProtein}&subcategory=${filterSubcategory}&searchQuery=${filterQuery}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}&pageSize=${filterPageSize}&price=${filterPrice}`;
  };
  console.log(category == 'Hrana');
  const postaviDijabeticara = (e) => {
    // alert('Postavljam dijabeticara');
    console.log(e);
    if (e === false) e = 'all';
    navigate(getFilterUrl({ diabetic: e }));
  };
  const postaviVegeterijanca = (e) => {
    console.log(e);
    if (e === false) e = 'all';
    navigate(getFilterUrl({ vegeterian: e }));
  };
  const postaviVegana = (e) => {
    console.log(e);
    if (e === false) e = 'all';
    navigate(getFilterUrl({ vegan: e }));
  };
  const postaviTrudnicu = (e) => {
    console.log(e);
    if (e === false) e = 'all';
    navigate(getFilterUrl({ trudnica: e }));
  };
  const postaviExp = (e) => {
    console.log(e);
    if (e === false) e = 'all';
    navigate(getFilterUrl({ exp: e }));
  };
  const postaviEko = (e) => {
    console.log(e);
    if (e === false) e = 'all';
    navigate(getFilterUrl({ eco: e }));
  };
  const postaviFeler = (e) => {
    console.log(e);
    if (e === false) e = 'all';
    navigate(getFilterUrl({ feler: e }));
  };
  const postaviPrvi = () => {
    setPrvi(false);
    return true;
  };
  let proba = 1;
  function klikni() {
    navigate(`/store/${id}`);
  }
  return (
    <div>
      <header className='pretraga'> 
      <div class="col-sm-1 col-md-1" >
      <Button onClick={klikni}>Nazad</Button>
      </div>
      <div class="col-sm-11 col-md-11">
      <SearchBoxZaProizvode storeId={id}/>
      </div>
      <title>Pretraga</title>
      </header>
      
        
      <Row>
      <Col md={3} className="advancedBaby">
          {categories.map((c) => (
            <div>
              {console.log(c)}

              {proba++ == 1 &&
                (c === 'Hrana' || c === 'Pice' || c === 'Namernice') && (
                  <div className='cekiraj'>
                  <Form>
                    <Form.Check
                      type={'checkbox'}
                      id={`Diabetic`}
                      label={`ㅤ Dijabeticar`}
                      onChange={(e) => postaviDijabeticara(e.target.checked)}
                    />
                    <br/>
                    <Form.Check
                      type={'checkbox'}
                      id={`Vegan`}
                      label={`ㅤ Vegan`}
                      onChange={(e) => postaviVegana(e.target.checked)}
                    />
                    <br/>
                    <Form.Check
                      type={'checkbox'}
                      id={`Vegeterian`}
                      label={`ㅤ Vegeterian`}
                      onChange={(e) => postaviVegeterijanca(e.target.checked)}
                    />
                    <br/>
                    <Form.Check
                      type={'checkbox'}
                      id={`Trudnica`}
                      label={`ㅤ Trudnica`}
                      onChange={(e) => postaviTrudnicu(e.target.checked)}
                    />
                    <br/>
                    <Form.Check
                      type={'checkbox'}
                      id={`Exp`}
                      label={`ㅤ Istek datuma upotrebe`}
                      onChange={(e) => postaviExp(e.target.checked)}
                    />
                  </Form>
                  </div>
                )}
              {drugi && (c == 'Higijena' || c == 'Ostalo') && (
                <Form>
                  {setDrugi(false)}
                  <Form.Check
                    type={'checkbox'}
                    id={`eco`}
                    label={`ㅤ Eko`}
                    onChange={(e) => postaviEko(e.target.checked)}
                  />

                  <Form.Check
                    type={'checkbox'}
                    id={`feler`}
                    label={`Feler`}
                    onChange={(e) => postaviFeler(e.target.checked)}
                  />
                </Form>
              )}
            </div>
          ))}
        <br/>
        
        <hr/>
        <h3 className="kategorija">Kategorija</h3>
          <div>
            <ul>
              <li className='proizvod'>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                  style={{ color: 'black', textDecoration: 'inherit' }}
                >
                  Sve
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c} className='proizvod'>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                    style={{ color: 'black', textDecoration: 'inherit' }}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <hr/>
            <h3 className="kategorija">Cena</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                  style={{ color: 'black', textDecoration: 'inherit' }}
                >
                  Sve
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-bold' : ''}
                    style={{ color: 'black', textDecoration: 'inherit' }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <hr/>
          <div>
              <ul>
              <h4 className="kategorija">Proteini</h4>
              {proteins.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ protein: p.value })}
                    className={p.value === protein ? 'text-bold' : ''}
                    style={{ color: 'black', textDecoration: 'inherit' }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <br/>
              <h4 className="kategorija">Masti</h4>
              {fats.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ fat: p.value })}
                    className={p.value === fat ? 'text-bold' : ''}
                    style={{ color: 'black', textDecoration: 'inherit' }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <br/>
              <h4 className="kategorija">Ugljeni hidrati</h4>
              {ugljenihidratis.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ ugljenihidrati: p.value })}
                    className={p.value === ugljenihidrati ? 'text-bold' : ''}
                    style={{ color: 'black', textDecoration: 'inherit' }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <hr/>
          <div>
            <h3 className="kategorija">Prosečna ocena</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                    style={{ color: 'black', textDecoration: 'inherit' }}
                  >
                    <Rating caption={' i više'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold' : ''}
                  style={{ color: 'black', textDecoration: 'inherit' }}
                >
                  <Rating caption={' i više'} rating={0}></Rating>
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
                  <div className="result-p">
                    {countProducts === 0 ? 'No' : countProducts} Rezultati pretrage
                    {category !== 'all' && ' : ' + category}
                    {subcategory !== 'all' && ' : ' + subcategory}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {searchQuery !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate(`/searchproduct/${id}`)}
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
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Najskorije istice rok</option>
                    <option value="lowest">Najjeftinije do najskuplje</option>
                    <option value="highest">Najskuplje do najjeftinije</option>
                    <option value="top-rated">Najbolje ocenjeni</option>
                    <option value="worst-rated">Najgore ocenjeni</option>
                  </select>
                </Col>
              </Row>
              {proizvodi.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {proizvodi.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product>
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
}
export default SearchProductsScreen;
