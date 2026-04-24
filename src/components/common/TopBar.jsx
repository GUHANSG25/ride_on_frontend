import React from 'react'
import '../../styles/SideBar.css';
import { useState } from 'react';
import { Provider } from 'react-redux';


export default function TopBar({profile}) {    
  return (
    <div>
        <div className="dashboard-topbar">
            <div className="dashboard-page-title">Hi, {profile ? profile.userName : "Guest"}</div>
              <div className="dashboard-topbar-right">
                <span className="dashboard-topbar-date">
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
                <div className="dashboard-status-pill">
                  <div className="dashboard-status-dot" />
                  System Online
                </div>
            </div>
        </div>
    </div>
  )
}
