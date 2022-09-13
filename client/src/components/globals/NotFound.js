import React from 'react'

import noDataIcon from '../../static/noDataIcon.png'

function NotFound() {
  return (
    <div className="">
        <div className="d-flex align-items-center justify-content-center">
        <img src={noDataIcon} alt="no data found" width="150px"/>
        </div>
        
        <h2 className="text-center">Oops! No Data Found.</h2>
    </div>
  )
}

export default NotFound