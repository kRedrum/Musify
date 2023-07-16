import React from 'react'

import { Card } from '../../components'

const Dashboard = () => {
  return (
    <div>
      <div className='xl:flex justify-between m-6'>
        <div className='xl:w-64 mb-6'>
          <Card title="Total Balance">
            <h1 className='text-3xl font-semibold'>HUF 0.00</h1>
          </Card>
        </div>
        <div className='xl:w-64 mb-6'>
          <Card title="Expense Activity">
            <h1 className='text-3xl font-semibold'>HUF 0.00</h1>
          </Card>
        </div>
        <div className='xl:w-64 mb-6'>
          <Card title="Income Activity">
            <h1 className='text-3xl font-semibold'>HUF 0.00</h1>
          </Card>
        </div>
      </div>
      <div id='daily-expense-line-chart' className='m-6'>
        <Card title="Daily Expense">
          <h1 className='text-3xl font-semibold'>ASD</h1>
        </Card>
      </div>
      <div id='transaction-table' className='m-6'>
        <Card title="Transaction">
          <h1 className='text-3xl font-semibold'>ASD</h1>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
