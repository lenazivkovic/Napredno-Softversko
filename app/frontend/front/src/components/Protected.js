import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { Store1 } from '../Store';

export default function Protected({children})
{
    const {state}=useContext(Store1);
    const {userInfo}=state;

    return userInfo? children:<Navigate to="/login" />
}