import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import NotFound from '../globals/NotFound'
import Restaurant from '../../static/restaurant.jpg'

function Hotels() {
    const [hotels, setHotels] = useState([]);

    // fetching rooms
    let fetchHotels = async () =>{
        const response = await fetch('/api/v1/hotels',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        if(response.status===200){
            setHotels(data.data);
        }else{
            console.log('error');
        }
    }

    useEffect(()=>{
        fetchHotels();
    },[]);

    return (
        <div>
            <section className="jumbotron text-center py-5">
                <div className="container">
                <h1 className="jumbotron-heading">Discover Hotels to Stay at</h1>
                <hr/>
                </div>
            </section>

            <div className="album py-5">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        
                        <Hotel/>
                        <Hotel/>
                        <Hotel/>
                        <Hotel/>
                    </div>

                </div>
            </div>
        </div>
    )
}

// {(hotels.length!==0)?hotels.map(function(hotel,index){
//     return(
//         <Hotel hotel={hotel} key={index}/>
//     )
// }):<NotFound/>} 

function Hotel(props){
    let hotel = props.hotel;
    // const imageLink = '/uploads/'+hotel.photo;
    // const emailLink = 'mailto:'+(hotel.email?hotel.email:"email@gmail.com");
    // const telLink = 'tel:'+(hotel.phone?hotel.phone:"078888888");
    // const roomsLink = '/stays/all?hotel='+(hotel.name?hotel.name:"marriot hotel");
    const roomsLink = '/stays/all?hotel='+("marriot hotel");
    return (
        <div className="col-md-6 col-lg-4 col-xl-4">
            <div className="card mb-4 box-shadow">
                <img className="card-img-top" style={{height:"18rem"}} src={Restaurant}/>
                <div className="card-body">
                    <h5 className="card-title bold">{"marriot hotel"}</h5>
                    <h6 className="bold text-muted">{"Kigali"}</h6>
                    <p className='card-text bold'>Average Cost: <span className="money">{"___"}</span> , <span>Average Rating: {"___"}</span></p>
                    <hr/>
                    <p><a className="bold" href="">{"email@email.com"}</a></p>
                    <p><a className="bold" href="">{"0788888888"}</a></p>
                    <hr/>
                    <p className="bold text-muted text-uppercase">{"lorem ipsum"}</p>
                    <br/>
                    <a href={"www.hotel.com"}>Read More</a><br/>
                    <Link to={roomsLink} className="text-right">Check out rooms</Link>
                </div>
            </div>
        </div>
    )
}

export default Hotels