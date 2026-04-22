import React from 'react'
import '../../styles/StatsGrid.css'

export default function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <div className="stat-card" key={i}>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">{stat.value}</span>
          <span className={`stat-sub ${stat.type === "pos" ? "text-success" : ""}`}>
            {stat.sub}
          </span>
        </div>
      ))}
    </div>
  );
}

