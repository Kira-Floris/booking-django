import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify'

import Rooms from './Rooms';
import Regions from '../globals/Regions';

function Stays(props) {
    let history = useHistory(); 
    const [rooms, setRooms] = useState([]);
    let {region} = useParams();
    const urlParams = new URLSearchParams(window.location.search);
    // fetching rooms
    let fetchRooms = async (e) =>{
        let link = '/api/v1/rooms?';
        if(region!=='all'){
            region = region.charAt(0).toUpperCase()+region.slice(1);
            link = link+'city='+region+'&';
        }
        // from hotels url params specifically
        if(urlParams.get("hotel")){
            link = link+'hotelName='+urlParams.get("hotel")+'&'
        }
        // check if filters values were entered
        if(e!==undefined){
            e.preventDefault();
            if(e.target.hotel.value.length!==0){
                link = link+'hotelName='+e.target.hotel.value+'&'
            }
            if(e.target.min.value.length!==0){
                link = link+'price[gte]='+e.target.min.value+'&'
            }
            if(e.target.max.value.length!==0){
                link = link+'price[lte]='+e.target.max.value+'&'
            }
        }
        const response = await fetch(link,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        if(response.status===200){
            setRooms(data);
        }else{
            toast.error('Sorry, something went wrong. Try refreshing the page')
        }
    }

    useEffect(()=>{
        fetchRooms();
    },[]);

    return (
        <div>
            <section className="jumbotron text-center py-5">
                <div className="container">
                <h1 className="jumbotron-heading">Discover Rooms to Stay In</h1>
                <hr/>
                </div>
            </section>
            <Regions/>
            <form className='container bg-light rounded p-4 border' method='post'>
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-6 col-lg-4 col-xl-3">
                        <label for="validationCustom01">Hotel Name</label>
                        <input type="text" className="form-control" id="validationCustom01" placeholder="Hotel Name" name="hotel"/>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                        <label for="validationCustom01">Min Price</label>
                        <input type="number" className="form-control" id="validationCustom01" placeholder="Minimum Price" name="min"/>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                        <label for="validationCustom01">Max Price</label>
                        <input type="number" className="form-control" id="validationCustom01" placeholder="Maximum Price" name="max"/>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <button type="submit" className="btn btn-success px-5 mt-4" name="submit">Filter</button>
                </div>
                
            </form>

            <div className="album py-5">
                <div className="container">
                    <Rooms rooms={rooms}/>
                </div>
            </div>
        </div>
    )
}

export default Stays