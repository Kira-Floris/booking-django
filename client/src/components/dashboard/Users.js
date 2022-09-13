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
    email:"",
    role:"",
    password:""
}

let urls = '/api/v1/users';

function Users() {
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

    let fetchList =async(e)=>{
        console.log("fetching...");
        var link = urls+"?"
        if(e!==undefined){
            e.preventDefault();
            if(e.target.names.value.length!==0){
                link = link+'name='+e.target.names.value+'&'
            }
            if(e.target.role.value.length!==0){
                link = link+"role="+e.target.role.value+"&"
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
        if(activeItem.name===""){
            activeItem.name=activeItem.title
        }
        if(editing===true){
            var pk = activeItem._id;
            method = "PUT";
            var temp = "/".concat(pk);
            url = urls.concat(temp);
            setEditing(false);
        }else{
            method = "POST";
            url = urls;
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
        var pk = task._id;
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
                                        <input type="text" className="form-control my-1" placeholder="Full Names" onChange={handleChange} id="title" name="title" value={activeItem.title}/>
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <input type="email" className="form-control my-1" placeholder="Email" onChange={handleChange} id="email" name="email" value={activeItem.email}/>
                                    </div>
                                    <div>
                                        <label>Role</label>
                                        <input type="text" className="form-control my-1" placeholder="role" onChange={handleChange} id="role" name="role" value={activeItem.role}/>
                                    </div>
                                    <div>
                                        <label>Password</label>
                                        <input type="password" className="form-control my-1" placeholder="password" onChange={handleChange} id="password" name="password" value={activeItem.password}/> 
                                    </div>
                                    <div>
                                        <input type="submit" className="form-control my-1 btn btn-primary" id="submit" placeholder="Submit"/>
                                    </div>
                                </form>
                            </div>
                            <div className="table-responsive col-md-12 col-lg-8">
                                <form className='container bg-light rounded p-4 border' onSubmit={fetchList} method='post'>
                                    <div className="row d-flex justify-content-center align-items-center">
                                        <div className="col-4">
                                            <label for="validationCustom01">Name</label>
                                            <input type="text" className="form-control" placeholder="Name" name="names"/>
                                        </div>
                                        <div className="col-4">
                                            <label for="validationCustom01">Role</label>
                                            <input type="text" className="form-control" placeholder="Role" name="role"/>
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
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="accordion accordion-flush">
                                    {list.map(function(item,index){
                                        
                                        return (
                                            <tr key={index}>                                            
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.role}</td> 
                                                <td className='d-flex'>
                                                    <span onClick={()=>startEdit(item)}><img src={updateIcon} width="30"/></span>
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
        </body>
    )
}

export default Users