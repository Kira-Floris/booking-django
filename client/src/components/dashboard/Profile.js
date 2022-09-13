import React,{useContext, useState, useEffect} from 'react'

import Header from './Header'
import Sidebar from './Sidebar'
import AuthContext from '../../context/AuthContext'
import { toast } from 'react-toastify'

let object = {
    title:"",
    name:"",
    email:""
}

let urls = '/api/v1/auth/updatedetails'
let passwordUrl = '/api/v1/auth/updatepassword'

function Profile() {
    let {user, authTokens, loggedUser} = useContext(AuthContext)
    let [person, setPerson] = useState({object})
    
    let getUser = () =>{
        setPerson({
            ...person,
            ["name"]:loggedUser.name,
            ["email"]:loggedUser.email,
            ["title"]:loggedUser.name,
        })
    }
    
    let handleChange=(e)=>{
        var name = e.target.name;
        var value = e.target.value;
        setPerson({
          ...person,
          [name]:value,
        });
    };
    let handleSubmit = async(e)=>{
        e.preventDefault();
        let response = await fetch(urls,{
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+String(authTokens)
            },
            body:JSON.stringify({"name":person.title,"email":person.email})
        });
        if(response.status===200){
            toast.success('Updated Successfully');
        }else{
            toast.error("Something Went Wrong")
        }
    }

    let handlePassword = async(e)=>{
        e.preventDefault();
        let response = await fetch(passwordUrl,{
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+String(authTokens)
            },
            body:JSON.stringify({"currentPassword":e.target.oldpassword.value,"newPassword":e.target.newpassword.value})
        });
        if(response.status===200){
            toast.success('Updated Successfully');
        }else{
            toast.error("Something Went Wrong")
        }
    }

    useEffect(()=>{
        getUser()
    },[])

    return (
        <div>
            <Header/>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar/>
                    <main className="col-10 ml-sm-auto pt-3 px-4" role="main">
                        <h2>Update Profile</h2>
                        <hr/>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Names</label>
                                <input type="text" name="title" className="form-control" placeHolder="Names" value={person.title} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" className="form-control" placeHolder="Email" value={person.email} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <input type="submit" name="submit" className="btn btn-primary my-2"/>
                            </div>
                        </form>
                        <hr/>
                        <h2>Update Password</h2>
                        <hr/>
                        <form onSubmit={handlePassword}>
                            <div className="form-group">
                                <label>Old Password</label>
                                <input type="password" name="oldpassword" className="form-control" placeHolder="Old Password" required/>
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" name="newpassword" className="form-control" placeHolder="New Password" required/>
                            </div>
                            <div className="form-group">
                                <input type="submit" name="submit" className="btn btn-primary my-2"/>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Profile