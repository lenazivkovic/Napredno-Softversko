import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingSign from '../components/LoadingSign';
import MessageBox from '../components/MessageBox';
import { Store1 } from '../Store';
import { getError } from '../utils';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchBoxZaUsere from '../components/SearchBoxZaUsere';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload.users,
        page: action.payload.page,
        pages: action.payload.pages,
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
export default function UserListScreen() {
  const navigate = useNavigate();
  const [query,setQuery]=useState('all');
  const [{ loading, error, users,pages, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
   
    const {search}=useLocation();
const sp=new URLSearchParams(search);
const page=sp.get('page' || 1);

  const { state } = useContext(Store1);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/users/searchUsers?page=${page}&searchQuery=${query}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data.data });
        console.log(data);
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
  }, [page,userInfo, successDelete,query]);

  const deleteHandler = async (user) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete korisnika?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`http://localhost:3000/api/v1/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Uspešno obirsan korisnik');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  return (
    
    <div>
      <title>Users</title>

      <h1>Korisnici</h1>
      <SearchBoxZaUsere query={setQuery} />
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
              <th>EMAIL</th>
              <th>IS ADMIN</th>
              <th>AKCIJE</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{(user.role==='store-admin' ? 'STORE_ADMIN' :(user.role==='lead-admin' ? 'LEAD_ADMIN' : 'NE' ))}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/leadadmin/user/${user._id}`)}
                  >
                    Izmeni
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
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
                to={`/leadadmin/users?page=${x + 1}`}
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
