import React from 'react'
import {Link} from 'react-router-dom'

function Sidebar() {
  return (
    <nav className="col-2 bg-light sidebar">
        <div className="sidebar-sticky">
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                        Dashboard
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/hotels">
                        Hotels
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/rooms">Rooms</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/booking">
                        Booking
                    </Link>
                </li>
                <hr/>
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/users">
                        Users
                    </Link>
                </li>
                <hr/>
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/profile">
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