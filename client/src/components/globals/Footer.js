import React from 'react';
import {Link} from 'react-router-dom';

import Menu from './Menu';
import Social from './Social'

import './Footer.css';

function Footer() {
  return (
    <footer className="blog-footer">
        <div className="row mx-0 pt-2">
            <div className="col-sm-12 col-xs-12 col-md-6 col-lg-6 col-xl-6">
                <h4 className="header-white text-center">Menu</h4>
                {Menu.map((item, index) => {
                    return (<div className='link-green' key={index}>
                        {item}
                    </div>)
                })}
            </div>
            <div className="col-sm-12 col-xs-12 col-md-6 col-lg-6 col-xl-6">
                <h4 className="header-white">Contact</h4>
                <ul className="list-unstyled">
                    {Social.map((item, index) => {
                        return (
                            <div className='link' key={index}>
                                {item}
                            </div>
                        );
                    })}
                </ul>
            </div>
        </div>
    </footer>
  );
}

export default Footer;