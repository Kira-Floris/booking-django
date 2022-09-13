import React from 'react'
import {useHistory,useParams} from 'react-router-dom'
import { toast } from 'react-toastify'

function ResetPassword() {
    let {token} = useParams()
    let history = useHistory();
    
    let handleSubmit = async (e) =>{
        e.preventDefault();
        let response = await fetch('/api/v1/auth/resetpassword/'+token,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({password:e.target.password.value})
        })
        let data = response.json();
        if(response.status===200){
            toast.success('Password Reset was Successful')
            history.push('/login')
        }else{
            toast.error('Something Went Wrong, try reentering the email')
            history.push('/forgotPassword')
        }
    }
    return (
        <div className="container py-5 mb-5">
            <h1>Reset Password</h1>
            <p className="display-5">One last Step.<br/>To reset your password, enter a new password.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group py-5">
                    <label className="my-4 h5">New Password</label>
                    <input type="password" className="form-control" placeholder="Enter a new password" name="password" required/>
                </div>
                
                <div className="form-group">
                    <input type="submit" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword