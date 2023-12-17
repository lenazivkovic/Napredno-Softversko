import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store1 } from '../Store';

const Admin = ({ children }) => {
  const { state } = useContext(Store1);
  const { userInfo } = state;

  return userInfo &&
    userInfo.data &&
    userInfo.data.user.role === 'store-admin' ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default Admin;
