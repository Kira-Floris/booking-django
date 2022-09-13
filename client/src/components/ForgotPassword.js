import React from 'react'
import { toast } from 'react-toastify';

function ForgotPassword() {
    let handleSubmit = async (e) =>{
        e.preventDefault();
        let response = await fetch('/api/v1/auth/forgotpassword',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({email:e.target.email.value,origin:window.location.origin})
        });
        let data = await response.json();
        if(response.status===200){
            toast.success('The reset link was sent to your email!')
        }else{
            toast.error('Something went wrong. Check the email you provided and resend!')
        }
    }
    return (
        <div className="container py-5 mb-5">
            <h1>Forgot Password?</h1>
            <p className="display-5">Enter the email you used registering or subscribing to the website, we will send you a reset link to it.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group py-5">
                    <label className="my-4 h5">Email</label>
                    <input type="email" className="form-control" placeholder="Enter the email you registered with" name="email" required/>
                </div>
                
                <div className="form-group">
                    <input type="submit" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword