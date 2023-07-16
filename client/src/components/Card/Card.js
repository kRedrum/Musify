import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { styled } from '@mui/material'
import clsx from 'clsx'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

import { saveToLocalStorage, readFromLocalStorage } from '../../utils'

import styles from './Card.styles'

const CardHeader = styled('div')(styles)
const CardBody = styled('div')(styles)

const Card = ({ title, children }) => {
  const [open, setOpen] = useState(readFromLocalStorage(`dashboard.open.${title}`) || true)

  const handleOpen = () => {
    saveToLocalStorage(`dashboard.open.${title}`, !open)
    setOpen(!open)
  }

  return (
    <div className='bg-primary p-4 rounded-lg shadow-md'>
        <CardHeader>
            <div className='Card-header'>
                <h2 className='text-lg font-semibold'>{title}</h2>
                <button className='bg-primary text-white rounded-md' onClick={handleOpen}>{!open ? <FaArrowUp /> : <FaArrowDown />}</button>
            </div>
        </CardHeader>
        <CardBody className={clsx({ 'p-4': !open })}>
            <div className={clsx('Card-body', { 'Card-body--closed': open })}>
                {children}
            </div>
        </CardBody>
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired
}

Card.defaultProps = {
  title: ''
}

export default Card
