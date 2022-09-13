import React from 'react';

import Menu from './Menu';

import './NavBar.css';

function NavBar() {
    const showNav = () => {
        document.getElementsByClassName('navigation')[0].classList.toggle('active');
    }
    return (
        <div className='navigation'>
            <div className='ham-btn' onClick={showNav}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className='links'>
                {Menu.map((item, index) => {
                    return (
                        <div className='link' key={index}>
                            {item}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default NavBar;