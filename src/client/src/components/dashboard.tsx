import * as React from 'react'
import { LineChart, Line, Brush } from 'recharts'

export class Dashboard extends React.Component {
  render() {
    const data = [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 1 }]
    return (
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <Brush />
      </LineChart>
    )
  }
}
