import React from 'react'
import {Link} from 'react-router-dom'
import {HashLink} from 'react-router-hash-link';

function page404() {
  return (
    <div className="container text-center py-5 my-5">
        <div className="row">
            <div className="col-md-12">
                <div className="error-template">
                    <h1>Oops!</h1>
                    <h2>Page Not Found</h2>
                    <div className="text-muted">
                        Sorry, an error has occured, Requested page not found!
                    </div>
                    <div className="error-actions py-5">
                        <Link to="/" className="btn link-green button-green mx-3">Back home</Link> 
                        <HashLink className='btn link-green button-green mx-3' to="/#contact">Contact Us</HashLink>   
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page404