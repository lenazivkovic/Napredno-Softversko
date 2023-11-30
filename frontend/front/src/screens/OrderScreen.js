import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Store1 } from '../Store';
import { Navigate, useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import LoadingSign from '../components/LoadingSign';
import axios from 'axios';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderScreen() {
  const { state } = useContext(Store1);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/users/orderHistory`,

          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(orders);

  const getFormattedDate = (selectedDate) => {
    const date = new Date(selectedDate);
    const formattedDate = date.toDateString();
    return formattedDate;
  };

  const getFormattedTime = (selectedDate) => {
    const date = new Date(selectedDate);
    const formattedTime = date.toLocaleTimeString();
    return formattedTime;
  };

  
  return (
    <div>
      <h1>Vaše Narudžbine</h1>
      {loading ? (
        <LoadingSign />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>KOD</th>
              <th>ARTIK</th>
              <th>DATUM</th>
              <th>SVEGA</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.code}>
                <td>{order.code}</td>

                <td>
                  {order.orderItems.reduce(function (prevVal, currVal, idx) {
                    return idx == 0
                      ? currVal.name + ' ×' + currVal.quantity
                      : prevVal + ', ' + currVal.name + ' ×' + currVal.quantity;
                  }, '')}
                </td>
                <td>{getFormattedDate(order.paidAt)} {getFormattedTime(order.paidAt)}</td>
                <td>
                  {order.orderItems &&
                    order.orderItems.reduce(
                      (p, c) => p + Number(c.price * c.quantity),
                      0
                    )}{' '}
                  rsd
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  }

