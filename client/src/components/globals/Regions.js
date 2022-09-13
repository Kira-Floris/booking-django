import React,{useState, useEffect} from 'react'

import Rwanda from '../../static/Rwanda.jpg';

import './Regions.css'

function Regions() {
    const [cities, setCities] = useState([]);

    let getCities = async() =>{
        const response = await fetch('/api/v1/utils/unique/cities',{
        method:'GET',
        headers:{
            'Content-Type': 'application/json'
        }
        });
        let data = await response.json();
        if(response.status===200){
          setCities(data.data);
        }
    }
    useEffect(()=>{
        getCities();
    },[]);
    return (
        <div className='container places'>
            <div className="row mb-2 lead d-flex justify-content-center align-items-center">
            <City city={"all"}/>
            
            <City/>
            <City/>
            </div>
        </div>
    )
}

// {cities.map((city, index)=>{
//   return(<City city={city} key={index}/>)
// })}

function City(props){
    const city = props.city;
    // const link = '/stays/'+city.toLowerCase();
    const link = '/stays/all';
    return (
      <div className="col-md-4 col-lg-4 col-xl-4">
        <a className="card bg-dark text-white pe-auto" onClick={()=>window.location.href=link}>
          <img className="card-img" src={Rwanda} alt="Card image"/>
          <div className="card-img-overlay d-flex align-items-center justify-content-center">
            <h3 className="card-title header-white">{city?city:"Kigali"}</h3>
          </div>
        </a>
      </div>
    )
  }

export default Regions