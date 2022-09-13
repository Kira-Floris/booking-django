import React,{useContext,useState,useEffect} from 'react'
import {toast} from 'react-toastify'
import $ from 'jquery';
import {Table} from 'react-bootstrap'
import axios from 'axios'

import updateIcon from '../../static/updateIcon.png'
import deleteIcon from '../../static/deleteIcon.png'

import AuthContext from '../../context/AuthContext'
import Header from './Header'
import Sidebar from './Sidebar'

import "bootstrap/js/src/collapse.js"

let object = {
    id:null,
    start:null,
    end:null,
    title:"",
    room:null,
    user:null
}

let urls = '/api/v1/book/rooms';
let roomsUrl = '/api/v1/rooms';

function Booking() {
    let {user, authTokens, logOut} = useContext(AuthContext);
    let [list, setList] = useState([]);
    let [rooms, setRooms] = useState([]);
    let [activeItem, setActiveItem] = useState(object);
    let [editing, setEditing] = useState(false);
    let [authTemp, setAuthTemp] = useState(localStorage.getItem('authTokens'))
    let [loading, setLoading] = useState(true)

    let getCookie = (name)=>{
        var cookieValue = null;
        if(document.cookie && document.cookie !== ''){
          var cookies = document.cookie.split(";");
          for(var i=0; i<cookies.length; i++){
            var cookie = cookies[i].trim();
            if(cookie.substring(0, name.length+1)===(name+'=')){
              cookieValue = decodeURIComponent(cookie.substring(name.length+1));
              break;
            }
          }
        }
        return cookieValue;
    };

    let handleChange=(e)=>{
        var name = e.target.name;
        var value = e.target.value;
        var temp = "";
        if(activeItem.name===""){
            temp=activeItem.title
        }
        setActiveItem({
          ...activeItem,
          [name]:value,
          ["name"]: temp
        });
    };

    let handleSubmit = async (e) =>{
        e.preventDefault();
        var url = "";
        var method = "";
        var csrftoken = getCookie("csrftoken");
        if(editing===true){
            var pk = activeItem._id;
            method = "PUT";
            var temp = "/".concat(pk);
            url = urls.concat(temp);
            setEditing(false);
        }else{
            method = "POST";
            url = roomsUrl+"/"+e.target.selectedRoom.value+"/book";
        }
        let response = await fetch(url,{
            method:method,
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + String(authTokens),
                "X-CSRFToken": csrftoken,
            },
            body:JSON.stringify(activeItem),
        })
        if(response.status===200){
            fetchList()
            toast.success("Action was Successful");
            setActiveItem(object);
        }else{
            toast.error(response.statusText)
        }
    }

    let startEdit=(task)=>{
        setActiveItem(task);
        setEditing(true);
    };

    let deleteItem=(item)=>{
        var crsftoken = getCookie("csrftoken");
        var pk = item._id;
        var url = urls.concat("/").concat(pk);
        fetch(url,{
          method:"DELETE",
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + String(authTokens),
            "X-CSRFToken": crsftoken,
          }
        }).then(response=>{
            fetchList()
          toast.success("Item deleted")
        });
      };

    let fetchRooms = async() =>{
      var crsftoken = getCookie("csrftoken");
      let response = await fetch('/api/v1/rooms',{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
        }
      })
      let data = await response.json();
      if(response.status===200){
        setRooms(data.data)
      }
    }

    let fetchRoom = async(roomId)=>{
        let response = await fetch('/api/rooms/'+roomId,{
            method:'GET',
        })
        let data = await response.json();
        if(response.status===200){
            return data.data.title+" , from "+data.data.hotel.name
        }else{
            return ""
        }
    }

    let fetchList = async()=>{
      let response = await fetch(urls,{
        method:"GET",
        headers:{"Authorization":"Bearer "+authTemp}
      })
      let data = await response.json();
      if(response.status===200){
        setList(data.data)
        console.log(data)
      }
    }

    useEffect(()=>{
      fetchList();
      fetchRooms();
    },[])

    

    
    return (
        <div>
            <Header/>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar/>
                    <main role="main" className="col-10 ml-sm-auto pt-3 px-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                            <h1 className="h2">Rooms</h1>
                        </div>

                        <div className="row">
                            <div className="col-md-12 col-lg-4 pb-5">
                                <form id="form" onSubmit={handleSubmit}>
                                    <div>
                                        <label>Start</label>
                                        <input type="datetime-local" className="form-control my-1" placeholder="Start Date" onChange={handleChange} id="start" name="start" value={activeItem.start}/>
                                    </div>
                                    <div>
                                        <label>End</label>
                                        <input type="datetime-local" className="form-control my-1" placeholder="End Date" onChange={handleChange} id="end" name="end" value={activeItem.end}/>
                                    </div>
                                    <div>
                                        <label>Rooms</label>
                                        <select className="form-select my-1" aria-label="Default select example" name="selectedRoom">
                                            <option value="">Open this select menu</option>
                                            {rooms?.map((room,index) =>{
                                                return (
                                                    <option value={room._id} key={index}>{room.title}</option>
                                                )
                                            })}
                                            
                                        </select>
                                    </div>
                                    <div>
                                        <input type="submit" className="form-control my-1 btn btn-primary" id="submit" placeholder="Submit"/>
                                    </div>
                                </form>
                            </div>
                            <div className="table-responsive col-md-12 col-lg-8">
                                <Table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Title</th>
                                    <th>Room, Hotel</th>
                                    <th>Days</th>
                                    <th>Cost</th>
                                    <th>CreatedAt</th>
                                    <th>User</th>
                                    <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="accordion accordion-flush">
                                    {list?.map(function(item,index){
                                        return (
                                              <tr key={index}>                                             
                                                  <td>{item.start}</td>
                                                  <td>{item.end}</td>
                                                  <td>{item.title}</td>
                                                  <td>{item.roomName?item.roomName+", "+item.hotelName:""}</td>
                                                  <td>{item.days}</td>
                                                  <td className="money">{item.cost}</td>
                                                  <td>{item.createdAt}</td>
                                                  
                                                  <td><a href={"mailto:"+item.userDetails}>{item.userDetails}</a></td>
                                                  <td className='d-flex'>
                                                      
                                                      <span onClick={()=>deleteItem(item)}><img src={deleteIcon} width="30"/></span>
                                                  </td>
                                              </tr>    
                                        )
                                    })}
                                </tbody>
                                </Table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
  )
}

export default Booking