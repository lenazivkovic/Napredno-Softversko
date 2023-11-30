import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import LoadingSign from '../components/LoadingSign';
import MessageBox from '../components/MessageBox';
import { Store1 } from '../Store';
import { useState } from 'react';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import SearchBoxZaOrderList from '../components/SearxhBoxZaOrderList';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function OrderListScreen() {
  const [query, setQuery] = useState('all');
  const [obrisano, setObrisano] = useState(false);
  const [pokupljeno, setPokupljeno] = useState(false);
  const navigate = useNavigate();
  const { state } = useContext(Store1);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/orders/searchOrder?searchQuery=${query}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data.data });
        console.log(orders);
        setObrisano(false);
        setPokupljeno(false);
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete, query, obrisano, pokupljeno]);

  const deleteHandler = async (order) => {
    if (window.confirm('Da li ste sigurni da zelite da obrisete narudzbinu?')) {
      try {
        //alert(userInfo.token);
        //dispatch({ type: 'DELETE_REQUEST' });
        // alert(order._id);
        await axios.patch(
          `http://localhost:3000/api/v1/stores/delete-order/${order._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Uspešno obrisana narudžbina');
        setObrisano(true);

        //successDelete = true;
        //dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        //dispatch({
        // type: 'DELETE_FAIL',
        // });
      }
    }
  };
  const pokupiHandler = async (order) => {
    if (window.confirm('Da li ste sigurni da je narudžbina pokupljena?')) {
      try {
        // alert(userInfo.token);
        //dispatch({ type: 'DELETE_REQUEST' });
        //alert(userInfo.token)
        await axios.patch(
          `http://localhost:3000/api/v1/orders/customer-pickup/${order.code}`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setPokupljeno(true);
        toast.success('Narudžbina je pokupljena!');
        //dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        const errCode = Number(err.message.split(' ')[5]);

        if (errCode == 411) {
          alert('Porudzbina je vec pokupljena');
        }
        toast.error(getError(error));
        //dispatch({
        // type: 'DELETE_FAIL',
        // });
      }
    }
  };
  return (
    <div>
      <title>Orders</title>
      <SearchBoxZaOrderList query={setQuery} />
      <h1>Narudzbine</h1>
      {loadingDelete && <LoadingSign></LoadingSign>}
      {loading ? (
        <LoadingSign></LoadingSign>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>KOD</th>
              <th>CENA</th>
              <th>DATUM</th>
              <th>POKUPLJENO</th>
              <th>PLACENO</th>
              <th>AKCIJA</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.code}</td>
                <td>
                  {order.orderItems &&
                    order.orderItems.reduce(
                      (p, c) => p + Number(c.price * c.quantity),
                      0
                    )}{' '}
                  rsd
                </td>
                <td>{order.paidAt.substring(0, 10)}</td>
                <td>
                  {order.stores.includes(userInfo.data.user.store)
                    ? 'NE'
                    : 'DA'}
                </td>
                <td>{order.confirmed ? 'DA' : 'NE'}</td>

                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/admin/order/${order._id}`);
                    }}
                  >
                    Detalji
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
                  >
                    Obriši
                  </Button>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => pokupiHandler(order)}
                  >
                    Pokupljeno
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
