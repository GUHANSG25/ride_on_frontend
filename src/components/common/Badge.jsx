import React from 'react'

export default function Badge({filtered}) {
  return (
    <div>
        <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: 12 }}>
            {filtered.length} {filtered.length !== 1 ? "records" : "record"}
        </span>
    </div>
  )
}
