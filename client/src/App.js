import React from 'react'
import { Route, Routes } from 'react-router-dom'

import modules from './App.module'
import { Sidebar } from './components'

function App () {
  return (
    <div>
      <Sidebar />
      <div className='sm:ml-64 ml-24 p-4 h-screen'>
        <Routes>
            {modules.map((module) => {
              return <Route key={module.id} path={module.path} element={module.component} />
            })}
        </Routes>
      </div>
    </div>
  )
}

export default App
