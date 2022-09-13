import React from 'react';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';

const menu = [
    <HashLink className='nav-link' to="/#home">Home</HashLink>,
    <HashLink className='nav-link' to="/#about">About Us</HashLink>,
    <Link className='nav-link btn-group dropdown' to="#">
        <span className="dropdown-toggle pe-auto" role="button" id="dropdownMenuButton" data-bs-toggle="dropdown">Stays</span>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" id="dropdownmenu">
            <li className="text-center"><Link to="/hotels">Hotels</Link></li>
            <li className="text-center"><Link to="/stays/all">Rooms</Link></li>
        </ul>
    </Link>,
    <HashLink className='nav-link' to="/#contact">Contact Us</HashLink>,
    <Link className="nav-link" to="/login">Login/Register</Link>,
];

export default menu;