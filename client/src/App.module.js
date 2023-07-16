import React from 'react'

import { Dashboard } from './modules'
import routes from './routes/routes'

const modules = [
  {
    id: 'dashboard',
    path: routes.Dashboard,
    component: <Dashboard />
  }
]

export default modules
