import classNames from 'classnames'
import * as React from 'react'
import {
  Legend,
  Line,
  LineChart,
  ReferenceArea,
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
  loading: boolean
}

const TooltipContent: React.StatelessComponent<any> = props => {
  if (!props.payload.length) return <div />

  const value = props.payload[0].value.toFixed(2)
  const valueClasses = classNames({
    'neg-return': value < 0,
    'pos-return': value > 0
  })

  return (
    <div>
      <div>{new Date(props.label).toLocaleDateString('en-UK')}</div>
      <div className={valueClasses}>
        {value}
        {props.payload[0].unit}
      </div>
    </div>
  )
}

export default class Graph extends React.Component<{}, DashState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      data: undefined,
      loading: true,
      returns: []
    }
  }

  public async componentDidMount() {
    const fundData: FundData = await Api.getByIsin('LU0862795506')
    const returns = fundData.returns.map(({ EndDate, Value }) => {
      return { date: EndDate, return: +Value }
    })
    this.setState({ data: fundData, returns, loading: false })
  }

  public render() {
    const name = this.state.data ? this.state.data.name : undefined

    if (this.state.loading) {
      return <div className="loadingspinner" />
    }

    return (
      <React.Fragment>
        <div>Cumulative Return</div>
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
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip content={TooltipContent} />
            <ReferenceArea
              x1={this.state.returns[0].date}
              x2={this.state.returns[this.state.returns.length - 1].date}
              y2={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    )
  }
}
