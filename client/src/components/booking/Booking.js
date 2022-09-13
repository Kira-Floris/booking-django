import React,{useState, useEffect, useContext} from 'react'
import {toast} from 'react-toastify'
import {useHistory} from 'react-router-dom';

import AuthContext from '../../context/AuthContext'

function Booking(props) {
    let {user, authTokens, logOut} = useContext(AuthContext)
    let history = useHistory();
    let room = props.room;
    const url = '/api/v1/rooms/'+room._id+"/book"

    let handleSubmit = async(e)=>{
      e.preventDefault();
      if(user===null){
        toast.info('You need to have an account to book a room')
        history.push('/login?back='+window.location.pathname)
      }else{
        let response = await fetch(url,{
          method:"POST",
          headers:{
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+String(authTokens)
          },
          body: JSON.stringify({"start":e.target.start.value,"end":e.target.end.value,"title":e.target.title.value})
        });
        let data
        if(response.status===200){
          toast.success("Your Booking was recorded, we will get in touch for more details")
        }else{
          toast.error(response.statusText)
        }
      }
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <h1>Book This room</h1>
        <div className="form-group">
          <label>Start Date</label>
          <input type="datetime-local" name="start" className="form-control" required/>
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="datetime-local" name="end" className="form-control" required/>
        </div>
        <div className="form-group">
          <label>Small Description</label>
          <input type="text" name="title" className="form-control"/>
        </div>
        <div className="form-group">
          <input type="submit" name="submit" className="btn btn-success my-2"/>
        </div>
      </form>
    )
}

export default Booking