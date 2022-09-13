import React from 'react'
import {Link} from 'react-router-dom'

function Sidebar() {
  return (
    <nav className="col-2 bg-light sidebar">
        <div className="sidebar-sticky">
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/booking">
                        Booking
                    </Link>
                </li>
                <hr/>
                <li className="nav-item">
                    <Link className="nav-link" to="/user">
                        Profile
                    </Link>
                </li>
                <hr/>
            </ul>
        </div>
        </nav>
  )
}

export default Sidebar