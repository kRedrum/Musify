import { useTheme } from '@mui/material/styles'
import ReactECharts from 'echarts-for-react'
import merge from 'lodash/merge'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import { TableStyles } from './styles'

const LineChart = ({ options = {} }) => {
  const { palette } = useTheme()
  const currentMonth = moment().month()
  const dataMonths = moment.months().map((month) => {
    if (month === moment.months(currentMonth)) {
      return {
        value: month,
        textStyle: TableStyles.Month
      }
    }
    return month
  })
  console.log(dataMonths)

  const baseOptions = useMemo(() =>
    ({
      colors: [palette.accent.positive, palette.accent.negative],
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        id: 'months',
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: dataMonths
      },
      yAxis: {
        type: 'value'
      }
    })
  , [palette])

  const chartOptions = merge(baseOptions, options)

  return <ReactECharts option={chartOptions} />
}

LineChart.propTypes = {
  options: PropTypes.shape({})
}

export default LineChart
