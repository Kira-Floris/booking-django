import React from 'react'
import {Link} from 'react-router-dom'
import {HashLink} from 'react-router-hash-link';
import UnauthorizedIcon from '../../static/UnauthorizedIcon.png'

function AccessDenied() {
  return (
    <div className="container text-center py-5 my-5">
        <div className="row">
            <div className="col-md-12">
                <div className="error-template">
                    <div className="d-flex align-items-center justify-content-center py-5">
                        <img src={UnauthorizedIcon} width="100px" className="border rounded" alt="UnAuthorized"/>
                    </div>
                    <h2>Access Denied</h2>
                    <div className="text-muted display-6 py-3">
                        This page is Restricted
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

export default AccessDenied