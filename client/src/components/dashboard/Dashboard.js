import React,{useEffect} from 'react'
import {Redirect,useHistory} from 'react-router-dom'

import Header from './Header'
import Sidebar from './Sidebar'

import './Dashboard.css'

function Dashboard() {
  const history = useHistory()
  useEffect(()=>{
    history.push('/dashboard/booking')
  })
  return (
    <body>
        <Header/>
        <div className="container-fluid">
            <div className="row">
                <Sidebar/>
                <main role="main" className="col-10 ml-sm-auto pt-3 px-4">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                    <h1 className="h2">Dashboard</h1>
                </div>

                <h2>All Bookings</h2>
                
                </main>
            </div>
        </div>
    </body>
  )
}

export default Dashboard