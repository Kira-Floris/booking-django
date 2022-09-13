import React from 'react'
import {Link} from 'react-router-dom'

import NotFound from '../globals/NotFound'

import Restaurant from '../../static/restaurant.jpg'

function Rooms(props) {
    // if(!props.rooms.data){
    //     return (<span></span>)
    // }
    // let rooms = props.rooms.data;
    return (
        <div className="row d-flex justify-content-center">
            
            <Room/>
            <Room/>
            <Room/>
            <Room/>
            <Room/>
            <Room/>
        </div>
  )
}

// {(rooms.length!==0)?rooms.map(function(room, index){
//     return (
//         <Room room={room} key={index}/>
//     )
// }):<NotFound/>}

const Room = (props) =>{
    let room = props.room;
    // const roomLink = "/room/"+(room._id?room._id:1);
    // const imageLink = "/uploads/"+room.photo;
    const roomLink = '/room/1'
    const imageLink = Restaurant
    return (
        <div className="col-md-6 col-lg-4 col-xl-4">
            <div className="card mb-4 box-shadow">
                <img className="card-img-top" style={{height:"18rem"}} src={Restaurant} />
                <div className="card-body">
                    <h6 className="card-title">{"room 4"} ~ {"marriot hotel"}</h6>
                    <p className="bold text-muted text-uppercase">{"Kigali"}</p>
                    <p className='card-text'><span className="money">{"11"}</span><span className="aftermoney">{"1"}</span></p>
                    <small>Baths: {"1"}, Rooms: {"3"}</small>
                    <br/>
                    <Link to={roomLink}>Read More and Book</Link>
                </div>
            </div>
        </div>
    )
}

export default Rooms