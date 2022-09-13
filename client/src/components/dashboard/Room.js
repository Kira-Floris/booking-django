import React,{useContext,useState,useEffect} from 'react'
import {toast} from 'react-toastify'
import $ from 'jquery';
import {Table} from 'react-bootstrap'

import updateIcon from '../../static/updateIcon.png'
import deleteIcon from '../../static/deleteIcon.png'

import AuthContext from '../../context/AuthContext'
import Header from './Header'
import Sidebar from './Sidebar'

import "bootstrap/js/src/collapse.js"

let object = {
    id:null,
    title:"",
    description:"",
    rooms:null,
    bath: null,
    price: null,
    days: null,
    city:"",
    hotelName:"",
    createdAt:null,
    user:null
}

let urls = '/api/v1/rooms';
let hotelUrl = '/api/v1/hotels';

function Room() {
    let {user, authTokens, logOut} = useContext(AuthContext);
    let [list, setList] = useState([]);
    let [hotels, setHotels] = useState([]);
    let [activeItem, setActiveItem] = useState(object);
    let [selectedFile, setSelectedFile] = useState();
    let [isFilePicked, setIsFilePicked] = useState(false);
    let [editing, setEditing] = useState(false);

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

    let fetchHotels = async()=>{
        let response = await fetch('/api/v1/hotels',{
          method: "GET",
          headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens),
          }
        } 
        );
        let data = await response.json();
        if(response.status === 200){
          setHotels(data.data);
        }else if(response.status===401){
          logOut();
        }
    }

    let fetchList =async(e)=>{
        var link = urls+"?"
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
            if(e.target.city.value.length!==0){
                link = link+"city="+e.target.city.value+"&"
            }
        }
        let response = await fetch(link,{
          method: "GET",
          headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens),
          }
        } 
        );
        let data = await response.json();
        if(response.status === 200){
          setList(data.data);
        }else if(response.status===401){
          logOut();
        }
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
            url = hotelUrl+"/"+e.target.selectedHotel.value+"/rooms";
        }
        console.log(activeItem);
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
            fetchList();
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
          fetchList();
          toast.success("Item deleted")
        });
      };

    const changeHandler = (event)=>{
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    }

    let uploadPhoto = async (e)=>{
        e.preventDefault();
        var csrftoken = getCookie("csrftoken");
        var pk = e.target.item.value
        var url = urls.concat("/").concat(pk).concat("/photo");
        const formData = new FormData();
        formData.append('photo',selectedFile);
        let response = await fetch(url,{
            method:"PUT",
            headers:{
                // "Content-Type":"application/json",
                "Authorization": "Bearer " + String(authTokens),
                "X-CSRFToken": csrftoken,
            },
            body:formData,
        })
        if(response.status===200){
            fetchList();
            toast.success("Photo Updated Successfully Successfully");
            setSelectedFile(null);
            setIsFilePicked(false);
        }else{
            toast.error(response.statusText)
        }
    }

    function onClickHandler(e) {
        const hiddenElement = e.currentTarget.nextSibling;
        hiddenElement.className.indexOf("collapse show") > -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show");
    };

    let handleReset = (e) =>{
        
        console.log('reset')
    }

    useEffect(()=>{
        fetchList();
        fetchHotels();
    },[]);

    return (
        <body>
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
                                        <label>Name</label>
                                        <input type="text" className="form-control my-1" placeholder="Room title" onChange={handleChange} id="title" name="title" value={activeItem.title}/>
                                    </div>
                                    <div>
                                        <label>Description</label>
                                        <textarea className="form-control my-1" placeholder="Description" onChange={handleChange} id="description" name="description" value={activeItem.description}></textarea>
                                    </div>
                                    <div>
                                        <label>Rooms</label>
                                        <input type="number" className="form-control my-1" placeholder="Rooms" onChange={handleChange} id="rooms" name="rooms" value={activeItem.rooms}/>
                                    </div>
                                    <div>
                                        <label>Bathrooms</label>
                                        <input type="number" className="form-control my-1" placeholder="Baths" onChange={handleChange} id="bath" name="bath" value={activeItem.bath}/>
                                    </div>
                                    <div>
                                        <label>Price in Dollars</label>
                                        <input type="price" className="form-control my-1" placeholder="Price in $" onChange={handleChange} id="price" name="price" value={activeItem.price}/>
                                    </div>
                                    <div>
                                        <label>Days on the Budget</label>
                                        <input type="number" className="form-control my-1" placeholder="days" onChange={handleChange} id="days" name="days" value={activeItem.days}/>
                                    </div>
                                    <div>
                                        <label>Hotel</label>
                                        <select class="form-select my-1" aria-label="Default select example" name="selectedHotel">
                                            <option selected>Open this select menu</option>
                                            {hotels.map((hotel,index) =>{
                                                return (
                                                    <option value={hotel._id}>{hotel.name}</option>
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
                                <form className='container bg-light rounded p-4 border' onSubmit={fetchList} method='post'>
                                    <div className="row d-flex justify-content-center align-items-center">
                                        <div className="col-3">
                                            <label for="validationCustom01">Hotel Name</label>
                                            <input type="text" className="form-control" id="validationCustom01" placeholder="Hotel Name" name="hotel"/>
                                        </div>
                                        <div className="col-3">
                                            <label for="validationCustom01">City</label>
                                            <input type="text" className="form-control" id="validationCustom01" placeholder="City" name="city"/>
                                        </div>
                                        <div className="col-3">
                                            <label for="validationCustom01">Min Price</label>
                                            <input type="number" className="form-control" id="validationCustom01" placeholder="Minimum Price" name="min"/>
                                        </div>
                                        <div className="col-3">
                                            <label for="validationCustom01">Max Price</label>
                                            <input type="number" className="form-control" id="validationCustom01" placeholder="Maximum Price" name="max"/>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <button type="submit" className="btn btn-primary px-5 mt-4 mx-2" name="submit">Filter</button>
                                        <a className="btn btn-secondary px-5 mt-4 mx-2" onClick={()=>window.location.href=""}>Clear Filter</a>
                                    </div>
                                    
                                </form>
                                <Table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                    <th>Photo</th>
                                    <th>Title</th>
                                    <th>Hotel</th>
                                    <th>City</th>
                                    <th>Rooms</th>
                                    <th>Bathrooms</th>
                                    <th>Price</th>
                                    <th>Days</th>
                                    <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="accordion accordion-flush">
                                    {list.map(function(item,index){
                                        const imageLink = "/uploads/"+item.photo
                                        return (
                                            <>
                                                <tr onClick={onClickHandler}>
                                                    <td><img src={imageLink} width="80" height="80"/></td>                                               
                                                    <td>{item.title}</td>
                                                    <td>{item.hotelName}</td>
                                                    <td>{item.city}</td>
                                                    <td>{item.rooms}</td>
                                                    <td>{item.bath}</td> 
                                                    <td className="money">{item.price}</td>
                                                    <td>{item.days}</td>
                                                    <td className='d-flex'>
                                                        <span onClick={()=>startEdit(item)}><img src={updateIcon} width="30"/></span>
                                                        <span onClick={()=>deleteItem(item)}><img src={deleteIcon} width="30"/></span>
                                                    </td>
                                                </tr>
                                                <tr className="collapse">
                                                    <td colSpan="3">
                                                        <img src={imageLink} width="200"/>
                                                        <form onSubmit={uploadPhoto}>
                                                            <input type="file" className="form-control" name="photo" onChange={changeHandler}/>
                                                            <input type="hidden" name="item" value={item._id}/>
                                                            <input type="submit" className="form-control btn btn-primary my-2"/>
                                                        </form>
                                                    </td>
                                                    <td colSpan="9">
                                                        <p>{item.description}</p>
                                                    </td>
                                                </tr>
                                            </>
                                                
                                        )
                                    })}
                                </tbody>
                                </Table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </body>
  )
}

export default Room