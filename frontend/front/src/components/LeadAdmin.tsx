import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { Store1 } from '../Store';

const LeadAdmin = ({children}) =>
{
    const {state}=useContext(Store1);
    const {userInfo}=state;

    return userInfo && userInfo.data.user.role==='lead-admin' ? children:<Navigate to="/login" />
}

export default LeadAdmin;