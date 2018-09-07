import * as React from 'react'
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { FundData } from '../../../data/fund-data'
import Api from '../api'

interface DashState {
  data: FundData | undefined
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
    this.state = { data: undefined, returns: [] }
  }

  public async componentDidMount() {
    const fundData: FundData = await Api.getByIsin('LU0862795506')
    const returns = fundData.returns.map(({ EndDate, Value }) => {
      return { date: EndDate, return: +Value }
    })
    this.setState({ data: fundData, returns })
  }

  public render() {
    const name = this.state.data ? this.state.data.name : undefined
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
        </LineChart>
      </ResponsiveContainer>
    )
  }
}
