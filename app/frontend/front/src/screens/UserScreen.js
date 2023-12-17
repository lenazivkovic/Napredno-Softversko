import axios from 'axios';
import React, { useState, useContext, useReducer } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Store1 } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loading: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loading: false };
    case 'UPDATE_FAIL':
      return { ...state, loading: false };
    case 'UPDATE_PASSWORD_REQUEST':
      return { ...state, loading: true };
    case 'UPDATE_PASSWORD_SUCCESS':
      return { ...state, loading: false };
    case 'UPDATE_PASSWORD_FAIL':
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default function SigninScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store1);
  const { userInfo } = state;
  console.log(state);
  const [name, setName] = useState(userInfo.data.user.name);
  const [address, setAddress] = useState(userInfo.data.user.address);
  const [email, setEmail] = useState(userInfo.data.user.email);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setpassword] = useState('');
  const [passwordConfirm, setpasswordConfirm] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      //  dispatch({type:'CREAT_REQUEST'});
      const { data } = await axios.patch(
        'http://localhost:3000/api/v1/users',
        {
          name,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });

      ctxDispatch({ type: 'USER_SIGNIN', payload: data.data });
      console.log('OVo sam dobio: ', data.data);
      localStorage.setItem('userInfo', JSON.stringify(data.data));

      userInfo.data.user.name = data.data.name;

      toast.success('Uspešno ažuriran korisnik');
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL' });
      toast.error(getError(err));
    }
  };

  const passwordSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      //  dispatch({type:'CREAT_REQUEST'});
      const { data } = await axios.patch(
        'http://localhost:3000/api/v1/users/updatePassword',
        {
          oldPassword: oldPassword,
          newPassword: password,
          newPasswordConfirm: passwordConfirm,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch({ type: 'UPDATE_PASSWORD_SUCCESS' });
      setpassword('');
      setpasswordConfirm('');
      setOldPassword('');
      alert('Uspesno promenjena lozinka');
    } catch (err) {
      dispatch({ type: 'FETCH_PASSWORD_FAIL' });

      toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <h1 className="my-3"> Profil </h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Ime</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Adresa</Form.Label>
          <Form.Control
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>
        <Button onClick={submitHandler}>Potvrdi</Button>
      </form>
      <form>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Stara lozinka</Form.Label>
          <Form.Control
          type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Nova lozinka</Form.Label>
          <Form.Control
           type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="passwordConfirm">
          <Form.Label>Potvrdi novu lozinku</Form.Label>
          <Form.Control
           type="password"
            value={passwordConfirm}
            onChange={(e) => setpasswordConfirm(e.target.value)}
            required
          />
        </Form.Group>
        <Button onClick={passwordSubmitHandler}>Promeni Lozinku</Button>
      </form>
    </div>
  );
}
