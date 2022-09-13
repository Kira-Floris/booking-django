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
    name:"",
    description:"",
    website:"",
    phone:"",
    email:"",
    address:"",
    location:{},
    city:"",
    averageRating:null,
    averageCost:null,
    createdAt:null,
    user:null
}

let urls = '/api/v1/hotels';

function Hotel() {
    let {user, authTokens, logOut} = useContext(AuthContext);
    let [list, setList] = useState([]);
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

    let fetchList =async()=>{
        console.log("fetching...");
        let response = await fetch(urls,{
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
        if(activeItem.title!==""){
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
            var pk = activeItem.id;
            method = "PUT";
            var temp = "/".concat(pk);
            url = urls.concat(temp);
            setEditing(false);
        }else{
            method = "POST";
            url = urls;
        }
        console.log(activeItem)
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
            toast.success("Item Created Successfully");
            setActiveItem(object);
        }else{
            toast.error(response.statusText)
        }
    }

    let startEdit=(task)=>{
        task.title=task.name
        setActiveItem(task);
        setEditing(true);
    };

    let deleteItem=(task)=>{
        var crsftoken = getCookie("csrftoken");
        var pk = task.id;
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

    useEffect(()=>{
        fetchList();
    },[]);
    

    return (
        <body>
            <Header/>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar/>
                    <main role="main" className="col-10 ml-sm-auto pt-3 px-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                            <h1 className="h2">Hotels</h1>
                        </div>

                        <div className="row">
                            <div className="col-md-12 col-lg-4 pb-5">
                                <form id="form" onSubmit={handleSubmit}>
                                    <div>
                                        <label>Name</label>
                                        <input type="text" className="form-control my-1" placeholder="Hotel Name" onChange={handleChange} id="title" name="title" value={activeItem.title}/>
                                    </div>
                                    <div>
                                        <label>Description</label>
                                        <textarea className="form-control my-1" placeholder="Description" onChange={handleChange} id="description" name="description" value={activeItem.description}></textarea>
                                    </div>
                                    <div>
                                        <label>Website</label>
                                        <input type="text" className="form-control my-1" placeholder="Website" onChange={handleChange} id="website" name="website" value={activeItem.website}/>
                                    </div>
                                    <div>
                                        <label>Phone</label>
                                        <input type="text" className="form-control my-1" placeholder="Phone" onChange={handleChange} id="phone" name="phone" value={activeItem.phone}/>
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <input type="email" className="form-control my-1" placeholder="Email" onChange={handleChange} id="email" name="email" value={activeItem.email}/>
                                    </div>
                                    <div>
                                        <label>Address</label>
                                        <input type="text" className="form-control my-1" placeholder="Address" onChange={handleChange} id="address" name="address" value={activeItem.address}/>
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
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Website</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>City</th>
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
                                                    <td>{item.name}</td>
                                                    <td>{item.website}</td>
                                                    <td>{item.phone}</td> 
                                                    <td>{item.email}</td>
                                                    <td>{item.city}</td>
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

export default Hotel