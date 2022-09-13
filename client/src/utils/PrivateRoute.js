import { Route, Redirect, useHistory} from 'react-router-dom'
import React,{useContext,useEffect, useState} from 'react';
import {toast} from 'react-toastify'

import AuthContext from '../context/AuthContext';
import AccessDenied from  '../components/globals/AccessDenied'

const PrivateRoute = ({children,roles, ...rest}) => {
    let history = useHistory();
    let [userRole,setUserRole] = useState("");
    let {user, logOut, authTokens} = useContext(AuthContext);
  
    if (!user) {
        toast.info('Login Required')
        return <Redirect to="/login"/>
    }

    let fetchMe = async()=>{
        let response = await fetch('/api/v1/auth/me',{
            method: 'GET',
            headers:{
                'Authorization': 'Bearer '+String(authTokens)
            }
        })
        let data = await response.json();
        if(response.status===200){
            setUserRole(data.data.role)
        }else{
            setUserRole(null)
            history.push('/')
        }
    }

    fetchMe()

    const userHasRequiredRole = user && roles.includes(userRole) ? true : false;
  
    if (user && !userHasRequiredRole) {
      return <AccessDenied />; // build your won access denied page (sth like 404)
    }

    return <Route {...rest}>{children}</Route>
  
  };

export default PrivateRoute