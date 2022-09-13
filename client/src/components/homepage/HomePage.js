import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';

import Contact from '../contact/Contact';
import Regions from '../globals/Regions'
import SomeHotels from './SomeHotels'

import CountrySide from '../../static/countryside.jpg';
import Travel from '../../static/travel.jpg';
import Kigali from '../../static/Kigali.jpg';
import Gisenyi from '../../static/Gisenyi.jpg';

import './HomePage.css';
import './cover.css';

function HomePage() {
  return (
    <div className='text-center'>
      <div className="homepage" id="home">
          <div 
            className="masthead"
            style={{background:`url(${Travel})`}}>
            <div className='color-overlay d-flex justify-content-center align-items-center'>
              <div>
                <div>The journey of a 1000 miles</div>
                <div>Begins with a journey to a 1000 hills</div>
                <Link to="/hotels" className="btn btn-light btn-lg my-4 rounded-50 button mx-2">Discover Hotels</Link>
                <HashLink to="#contact" className="btn btn-light btn-lg my-4 rounded-50 button mx-2">Drop a Message</HashLink>
                
              </div>  
            </div>
          </div>
      </div>
      <Link to="/#about" id={`about`} className="text-decoration-none"></Link>
      <div class="row featurette container py-5 mx-auto">
        <div class="col-md-7 d-flex justify-content-center align-items-center">
          <span>
            <Link to="/#about" id={`about`} className="text-decoration-none"></Link>
            <h2 class="featurette-heading">Who we are!<span class="text-muted">A Tour Company.</span></h2>
            <p class="lead featurette-description">We are a tour company based in Rwanda.<br/>We offer booking services on your behalf working with hotels in Rwanda to provide the best travelling experience.</p>
          </span>
        </div>
        <div class="col-md-5 d-flex justify-content-center align-items-center">
          <img class="featurette-image img-fluid mx-auto" src={Travel} alt="Traveling Company picture"/>
        </div>
      </div>
      <hr className="container"/>
      <div className="popular py-5 container">
        <h1>most visited places</h1>

        <div className="row mb-2">
          <div className="col-md-6">
            <div className="card flex-md-row mb-4 box-shadow h-md-250">
              <div className="card-body d-flex flex-column w-50">
                <h2>Kigali City</h2>
                <p className="card-text mb-auto lead">Being the capital city of Rwanda, it holds many hotels, historical museum and many exciting places to visit.</p>
              </div>
              <img className="card-img-right flex-auto d-none d-lg-block w-50" src={Kigali} alt="Card image cap"/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card flex-md-row mb-4 box-shadow h-md-250">
              <div className="card-body d-flex flex-column w-50">
                <h2>Gisenyi</h2>
                <p className="card-text mb-auto lead">Enjoy your stay near the lake Kivu, with access to swimming and a wide community of Rwandans and Congolese.</p>
              </div>
              <img className="card-img-right flex-auto d-none d-lg-block w-50" src={Gisenyi} alt="Card image cap"/>
            </div>
          </div>
        </div>
      </div>
      <div className='services' style={{background:`url(${CountrySide})`}}>
        <div className='service-overlay'>  
          <h1 className="header-white py-2">Some of Hotels</h1>
          <div className="container">
            <SomeHotels/>
          </div>
        </div>
      </div>
      <div className='places py-5'>
        <h1>locations</h1>
        <Regions/>
      </div>
      <hr className='container'/>
      <Contact/>
    </div>
  );
}



export default HomePage;