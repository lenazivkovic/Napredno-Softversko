import React, {useState, useContext, useEffect, useReducer } from 'react';
import * as XLSX from 'xlsx';

import { PDFDocument,pdfjs } from 'pdfjs-dist';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Store1 } from '../Store';
import LoadingSign from '../components/LoadingSign';
import MessageBox from '../components/MessageBox';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const [excelContent, setExcelContent] = useState([]);
  const { state } = useContext(Store1);
  const { userInfo } = state;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/products/admin?page=${page} `,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data.data });
      } catch (err) {
        alert(err.message);
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  function createHandler() {
    navigate(`/admin/createproduct`);
  }
  function createTroughExcelHandler() {
    // if (window.confirm('Are you sure to create?')) {
    //   try {
    //     dispatch({ type: 'CREATE_REQUEST' });
    //     const { data } = await axios.post(
    //       '/api/products',
    //       {},
    //       {
    //         headers: { Authorization: `Bearer ${userInfo.token}` },
    //       }
    //     );
    //     toast.success('product created successfully');
    //     dispatch({ type: 'CREATE_SUCCESS' });
    //     navigate(`/admin/product/${data.product._id}`);
    //   } catch (err) {
    //     toast.error(getError(error));
    //     dispatch({
    //       type: 'CREATE_FAIL',
    //     });
    //   }
    // }
   
  }
  const deleteHandler = async (product) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete proizvod?')) {
      try {
        console.log(product);
        await axios.delete(
          `http://localhost:3000/api/v1/products/${product._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Proizvod uspešno obrisan');
        dispatch({ type: 'DELETE_SUCCESS', successDelete: true });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

 
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      setExcelContent(jsonData);
      console.log(jsonData);
      console.log(excelContent);
      // Here, you can use the extracted data in your React component's state or perform any other operations.
    };

    reader.readAsArrayBuffer(file);
  };
  
  return (
    <div>
      <Row>
        <Col>
          <h1>Proizvodi</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Dodaj Proizvod
            </Button>
          {/*   <Button type="button" onClick={createTroughExcelHandler}>
              Dodaj Proizvode Kroz Excel
            </Button>
            <input type="file" accept=".ods" onChange={handleFileChange} /> */}
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingSign></LoadingSign>}
      {loadingDelete && <LoadingSign></LoadingSign>}
      {loading ? (
        <LoadingSign></LoadingSign>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>IME</th>
                <th>CENA</th>
                <th>KATEGORIJA</th>
                <th>STANJE</th>
                <th>NAJBOLJE UPOTREBITI DO</th>
                <th>AKCIJE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}rsd</td>
                  <td>{product.category}</td>
                  <td>{product.countInStock}</td>
                  <td>
                    {product.expirationDate
                      ? product.expirationDate.split('T')[0]
                      : ''}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Izmeni
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Obriši
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
