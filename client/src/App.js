import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import $ from 'jquery'
import Popper from 'popper.js'
import 'react-toastify/dist/ReactToastify.css'

import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import {useState, useEffect, useContext} from 'react'
import {ToastContainer} from 'react-toastify'

import HomePage from './components/homepage/HomePage'
import Hotels from './components/stays/Hotels';
import Stays from './components/stays/Stays'
import Room from './components/stays/Room'

import Header from './components/globals/NavBar'
import Footer from './components/globals/Footer'
import Login from './components/globals/Login'

import Dashboard from './components/dashboard/Dashboard';
import HotelDashboard from './components/dashboard/Hotel'
import RoomDashboard from './components/dashboard/Room'
import UserDashboard from './components/dashboard/Users'
import Profile from './components/dashboard/Profile'
import ResetPassword from './components/ResetPassword'
import ForgotPassword from './components/ForgotPassword'
import Booking from './components/dashboard/Booking'

import UserBooking from './components/user/UserBooking'
import UserProfile from './components/user/Profile'

import page404 from './components/globals/page404';

import PrivateRoute from './utils/PrivateRoute'
import {AuthProvider} from './context/AuthContext'

function App() {
  return (
    <div className="App">
      <ToastContainer/>
      <Router>
        <Header/>
        <AuthProvider>
        <Switch>
        <Route component={HomePage} path="/" exact/> 
        <Route component={Room} path="/room/:id" exact/>
        <Route component={Hotels} path="/hotels" exact/>
        <Route component={Stays} path="/stays/:region" exact/>

        <PrivateRoute component={Dashboard} roles={['admin','staff']} path='/dashboard' exact/>
        <PrivateRoute component={HotelDashboard} roles={['admin','staff']} path='/dashboard/hotels' exact/>
        <PrivateRoute component={RoomDashboard} roles={['admin','staff']} path='/dashboard/rooms' exact/>
        <PrivateRoute component={UserDashboard} roles={['admin','staff']} path="/dashboard/users" exact/>
        <PrivateRoute component={Profile} roles={['admin','staff']} path="/dashboard/profile" exact/> 
        <PrivateRoute component={Booking} roles={['admin','staff']} path="/dashboard/booking" exact/>

        <PrivateRoute component={UserProfile} roles={["admin",'staff','user']} path='/user' exact/>
        <PrivateRoute component={UserBooking} roles={['admin','staff','user']} path="/booking" exact/>

        <Route component={ForgotPassword} path="/forgotpassword" exact/>
        <Route component={ResetPassword} path="/resetpassword/:token" exact/>

        <Route component={Login} path='/login'/>
        <Route component={page404} path="*"/> 
        </Switch>
        </AuthProvider>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;