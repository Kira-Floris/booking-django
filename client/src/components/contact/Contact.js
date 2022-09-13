import React from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify';

import Call from '../../static/call.jpg';

import './Contact.css'

function Contact() {
  async function sendEmail(e){
    e.preventDefault();
    const response = await fetch('/api/v1/utils/contact',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"email":e.target.email.value,"subject":e.target.subject.value,"message":e.target.message.value})
    })
    let data = await response.json();
    if(response.status===200){
      console.log('sent')
      toast.success('We have received your email, we will get in touch.')
    }else{
      toast.error('Sorry, something went wrong. Please try again later!')
    }
  }
  return (
    <div className="contact container py-5">
        <div className="card flex-md-row mb-4 box-shadow h-md-250 bg-light">
            <div className="card rounded-0 bg-dark text-white flex-auto d-none d-lg-block w-50">
              <img className="card-img" src={Call} alt="Card image"/>
              <div className="card-img-overlay d-flex align-items-center justify-content-center">
                <h5 className="card-title header-white">Email Us...</h5>
              </div>
            </div>
            <div className="card-body d-flex flex-column w-50">
                <Link to="/#contact" id={`contact`} className="text-decoration-none"><h1>Drop a message</h1></Link>
                <form className="text-start px-3" onSubmit={sendEmail} method="post">
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="john.smith@example.com" name="email" required/>
                    </div>
                    <div className="form-group">
                        <label>Subject</label>
                        <input type="text" className="form-control" placeholder="John Smith" name="subject" required/>
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea className="form-control" rows="2" placeholder="Hello there..." name="message" required></textarea>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                    <button type="submit" className="btn btn-success mb-2 my-4">Send Email</button>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
  )
}

export default Contact