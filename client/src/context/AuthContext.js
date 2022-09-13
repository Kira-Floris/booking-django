import { createContext, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {toast} from 'react-toastify'

import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({children}) =>{

    let authExists = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    let userExists = localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null
    let [authTokens, setAuthTokens] = useState(()=>authExists);
    let [user, setUser] = useState(()=>userExists);
    let [loggedUser, setLoggedUser] = useState({})
    let [loading, setLoading] = useState(true)

    const history = useHistory()

    let loginUser = async(e) =>{
        e.preventDefault();
        const url = '/api/v1/auth/login'
        let back = e.target.back.value;
        try{
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"email":e.target.email.value.toString(),"password":e.target.password.value.toString()})
            })
            let data = await response.json();
            let userRole = ""
            if (response.status === 200){
                setAuthTokens(data.token);
                setUser(jwt_decode(data.token));
                localStorage.setItem('authTokens',JSON.stringify(data.token));
                // get the user role
                const urlUser = '/api/v1/auth/me';
                let res = await fetch(urlUser,{
                    method: 'GET',
                    headers:{
                        'Content-type':'application/json',
                        'Authorization': 'Bearer '+String(data.token)
                    }
                });
                let dat = await res.json();
                if(res.status === 200){
                    userRole = dat.data.role;
                }
                if(back.length!==0){
                    toast.success('Logged in Successfully')
                    history.push(back)
                }
                if(userRole==="user"){
                    toast.success("Logged in successful")
                    history.push('/booking')
                }else{
                    toast.success('Logged in Successfully')
                    history.push('/dashboard')
                }
            }else{
                toast.error('Something occured, try again later!')
            }
        } catch(err){
            toast.error('Error '+ err)
            setAuthTokens(null);
            setUser(null);
            localStorage.removeItem('authTokens');
        }
        
    }

    let registerUser = async(e)=>{
        e.preventDefault();
        const url = '/api/v1/auth/register';
        let response = await fetch(url,{
            method:"POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify({"email":e.target.email.value,"name":e.target.names.value,"password":e.target.password.value}),
        });
        let data = await response.json();
        let userRole = ""
        if(response.status===200){
            toast.success('Registration Successful, we are currently logging you in')
            setAuthTokens(data.token);
            setUser(jwt_decode(data.token));
            localStorage.setItem('authTokens',JSON.stringify(data.token));
            // get the user role
            const urlUser = '/api/v1/auth/me';
            let res = await fetch(urlUser,{
                method: 'GET',
                headers:{
                    'Content-type':'application/json',
                    'Authorization': 'Bearer '+String(data.token)
                }
            });
            let dat = await res.json();
            if(res.status === 200){
                userRole = dat.data.role;
            }else{
                toast.info('Try login in now!')
                history.push('/login')
            }
            if(userRole==="user"){
                toast.success("Thanks for subscribing as our user")
                history.push('/booking')
            }else{
                toast.success('Logged in Successfully')
                history.push('/dashboard')
            }
        }else{
            toast.error('Something Went Wrong, Please Try Again Later')
        }
    };

    let loggedInUser = async()=>{
        const url = '/api/v1/auth/me';
        let response = await fetch(url,{
            method: 'GET',
            headers:{
                'Content-type':'application/json',
                'Authorization': 'Bearer '+String(authTokens)
            }
        });
        let data = await response.json();
        if(response.status === 200){
            setLoggedUser(data.data);
        }else{
            setLoggedUser(null)
        }
    }

    let logOut = () => {
        toast.info('You are currently being logged out')
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        history.push('/login')
    }

    let checkTokenValidation = async()=>{
        const tok = localStorage.getItem('authTokens');
        const decodedToken = jwt_decode(tok);
        if(!decodedToken.id){
            logOut();
        }
        if(loading){
            setLoading(false);
        }
    }


    useEffect(()=>{
        if(loading){
            checkTokenValidation();
        }
    },[authTokens, loading])

    let contextData = {
        user,
        authTokens,
        loginUser:loginUser,
        registerUser:registerUser,
        logOut:logOut,
        loggedInUser:loggedInUser,
        loggedUser:loggedUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}