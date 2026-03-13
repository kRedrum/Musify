import React from 'react'

// eslint-disable-next-line react/prop-types
const SidebarItem = ({ icon, title }) => {
  return (
    <a className="sidebar-item">
      <div className="sm:mr-6">{icon}</div>
      <div className='max-sm:hidden'>{title}</div>
    </a>
  )
}

export default SidebarItem
