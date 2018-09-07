import * as React from 'react'
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceArea
} from 'recharts'
import Api from '../api'
import { FundData } from '../../../data/fund-data'

interface DashState {
  data: FundData | null
  returns: { date: string; return: number }[]
}

const TooltipContent: React.StatelessComponent<any> = props => (
  <div>
    <div>{props.label}</div>
    <div>
      {props.payload[0] && props.payload[0].value}
      {props.payload[0] && props.payload[0].unit}
    </div>
  </div>
)

export class Dashboard extends React.Component<{}, DashState> {
  constructor(props: {}) {
    super(props)
    this.state = { data: null, returns: [] }
  }

  async componentDidMount() {
    const fundData: FundData = await Api.getByIsin('LU0862795506')
    const returns = fundData.returns.map(({ EndDate, Value }) => {
      return { date: EndDate, return: +Value }
    })
    this.setState({ data: fundData, returns })
  }

  render() {
    const name = this.state.data ? this.state.data.name : undefined

    let referenceArea = null

    if (this.state.returns.length) {
      referenceArea = (
        <ReferenceArea
          x1={this.state.returns[0].date}
          x2={this.state.returns[this.state.returns.length - 1].date}
          y2={0}
        />
      )
    }

    return (
      <ResponsiveContainer>
        <LineChart width={400} height={400} data={this.state.returns}>
          <Line
            name={name}
            type="monotone"
            dataKey="return"
            unit="%"
            stroke="#8884d8"
            dot={false}
          />
          <XAxis dataKey="date" />
          <YAxis dataKey="return" unit="%" />
          <Legend verticalAlign="top" height={36} />
          <Tooltip content={TooltipContent} />
          {referenceArea}
        </LineChart>
      </ResponsiveContainer>
    )
  }
}
