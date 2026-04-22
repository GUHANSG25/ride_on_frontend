import React from 'react'

export default function Search({searchFields,  query, onQueryChange}) {

  return (
    <div>
        {searchFields?.length > 0 && (
          <input type="text" placeholder="Search…" value={query} onChange={(e) => onQueryChange(e.target.value)}
            className="form-control form-control-sm" style={{ width: 230,height: 20 }}
          />
        )}
    </div>
  )
}
