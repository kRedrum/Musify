import ReactECharts from 'echarts-for-react'
import merge from 'lodash/merge'
import PropTypes from 'prop-types'
import React from 'react'

const BarChart = ({ dataXAxis = [], dataYAxis = [], type = 'category', ...args }) => {
  const baseOptions = {
    // xAxis: {
    //   type: type || 'category',
    //   data: dataXAxis
    // },
    // yAxis: {
    //   type: type || 'value'
    // }
  }
  const options = merge(baseOptions, args)

  return <ReactECharts option={options} />
}

BarChart.propTypes = {
  dataXAxis: PropTypes.array,
  dataYAxis: PropTypes.array,
  type: PropTypes.oneOf(['value', 'category', 'time', 'log'])
}

export default BarChart
