import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'

import Booking from '../booking/Booking'
import NotFound from '../globals/NotFound'

import Restaurant from '../../static/restaurant.jpg'

function Room() {
    const {id} = useParams()
    const [room, setRoom] = useState({});
    const [hotel, setHotel] = useState({});
    const [location, setLocation] = useState({});
    const [imageLink, setImageLink] = useState();
    let fetchRoom = async() =>{
        const response = await fetch(`/api/v1/rooms/${id}`,{
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        if(response.status===200){
            setRoom(data.data);
            setHotel(data.data.hotel);
            setLocation(data.data.hotel.location);
            setImageLink(`/uploads/${data.data.photo}`);
        }else{
            console.log('error')
        }
    }
    useEffect(()=>{
        fetchRoom();
    },[])
    if(room.length===0){
        return (<NotFound/>)
    }
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-12 col-lg-6">
                    <img className="d-block w-100 border-top border-bottom" src={imageLink?imageLink:Restaurant} alt={room.title}/>
                </div>
                <div className="col-md-12 col-lg-6 py-3 d-flex align-items-center">
                <div>
                    <h2>{room.title?room.title:"room 2"} ~ <span className="text-muted">{hotel.name?hotel.name:"marriot hotel"}</span></h2>
                    <h3>{location.city}</h3>
                    <p><span className="bold money">{room.price?room.price:"11"}</span><span className="aftermoney text-muted">{room.days?room.days:"1"}</span></p>
                    <div className="py-2 h6">
                        <span>rooms: {room.rooms?room.rooms:"3"}</span>
                        <span> bath: {room.days?room.bath:"1"}</span>
                    </div>
                    <p>{room.description?room.description:"lorem ipsum"}</p>
                    <hr/>
                    <Booking room={room}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Room