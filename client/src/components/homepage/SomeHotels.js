import React,{useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import {API_URL} from '../../env'
console.log(API_URL)

let urls = '/api/v1/hotels?sort=-averageCost&limit=3'

function SomeHotels() {
    let [hotels, setHotels] = useState([]);
    let fetchHotels = async()=>{
        let response = await fetch(urls,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if(response.status === 200){
            setHotels(data.data)
        }
    }

    useEffect(()=>{
        fetchHotels()
    },[]);
    return (
        <div className="row mb-2 lead services-overlay d-flex justify-content-center align-items-center">
            
            {hotels.map((hotel, index)=>{
                return (
                    <div className="col-md-6 col-lg-4" key={index}>
                    <div className="card mb-4 box-shadow rounded-0" key={index}>
                        <div className="card-body">
                            <h3 className="header-white">{hotel.name}</h3>
                            <p className="card-text text-white">Located in {hotel.location.city}</p> 
                            {hotel.averageCost?<p className="card-text text-white">With Average Price: <span className="money">{hotel.averageCost}</span></p>:""}
                            
                        </div>
                    </div>
                    </div>
                )
            })}
            <div className="d-flex justify-content-center align-items-center">
                <Link to="/hotels" className="btn btn-light btn-lg my-4 rounded-50 button mx-2" style={{width:"300px"}}>Discover More Hotels</Link>
            </div>
        </div>
    )
}

export default SomeHotels