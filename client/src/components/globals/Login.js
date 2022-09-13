import React,{useContext, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'

import AuthContext from '../../context/AuthContext'

import loginIcon from '../../static/loginIcon.png'
import registerIcon from '../../static/registerIcon.png'

import './Login.css'

function Login() {
    let {loginUser, registerUser, logOut} = useContext(AuthContext)
    const urlParams = new URLSearchParams(window.location.search);
    const back = urlParams.get("back")
    useEffect(()=>{
        logOut();
    },[])
    
    return (
        <div className="container-fluid">
            <div className="row d-flex justify-content-center align-items-center forms-container">
                
                <form className="container col-md-12 py-5 bg-light rounded m-2 p-4 forms" onSubmit={loginUser} method='post'>
                    <div className="d-flex align-items-center justify-content-center">
                        <p className="display-5">login</p>    
                        <img className="mb-4 border rounded" src={loginIcon} alt="" width="72" height="72"/>
                        
                    </div>    
                    
                    <div className="form-group my-2">
                        <label>Email</label>
                        <input type="email" className="form-control" name="email" placeholder="Enter your Email" required/>
                    </div>
                    <div className="form-group my-2">
                        <label>Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" name="password" placeholder="Password" required/>
                    </div>
                    <input type="hidden" name="back" value={back}/>
                    <div className="d-flex justify-content-center align-items-center">
                        <Link to="/forgotpassword" className="mx-2">forgot Password?</Link><button type="submit" className="m-2 btn btn-primary">Submit</button>
                    </div>
                    
                </form>

                <form className="container col-md-12 border rounded py-5 m-2 p-4 forms" onSubmit={registerUser} method='post'>
                    <div className="d-flex align-items-center justify-content-center">
                        <img className="mb-4 border rounded" src={registerIcon} alt="" width="72" height="72"/>
                        <p className="display-5">register</p>
                    </div> 
                    <div className="form-group my-2">
                        <label>Email</label>
                        <input type="email" className="form-control" name="email" placeholder="Enter your Email" required/>
                    </div>
                    <div className="form-group my-2">
                        <label>Full Name</label>
                        <input type="text" className="form-control" name="names" placeholder="Enter your Full Name" required/>
                    </div>
                    <div className="form-group my-2">
                        <label>Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword2" name="password" placeholder="Password" required/>
                    </div>
                    <button type="submit" className="my-2 btn btn-primary">Submit</button>
                </form>
            </div>
        </div>

    )
}

export default Login