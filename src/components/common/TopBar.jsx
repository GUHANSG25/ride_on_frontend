import React from 'react'
import '../../styles/SideBar.css';
import { useState } from 'react';


export default function TopBar({activeSection}) {    
  return (
    <div>
        <div className="dashboard-topbar">
            <div className="dashboard-page-title">{activeSection}</div>
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
