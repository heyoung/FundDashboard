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

interface GraphState {
  data: FundData[] | undefined
  isLoading: boolean
  values: any[]
}

interface GraphProps {
  data: FundData[]
  isLoading: boolean
}

export default class Graph extends React.Component<GraphProps, GraphState> {
  constructor(props: GraphProps) {
    super(props)

    this.state = {
      data: props.data,
      isLoading: props.isLoading,
      values: this.getValues(props.data)
    }
  }

  public componentWillReceiveProps(props: GraphProps) {
    this.setState({ ...props, values: this.getValues(props.data) })
  }

  public render() {
    const fundNames = this.state.data ? this.state.data.map(d => d.name) : []

    if (!fundNames.length && !this.state.isLoading) return <NoGraphMessage />

    if (this.state.isLoading) return <LoadingSpinner />

    return (
      <React.Fragment>
        <div className="graph__title">Cumulative Return</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={400} height={400} data={this.state.values}>
            {fundNames.map(name => {
              return (
                <Line
                  key={name}
                  name={name}
                  type="monotone"
                  dataKey={name}
                  unit="%"
                  stroke="#8884d8"
                  dot={false}
                />
              )
            })}
            <XAxis dataKey="date" />
            <YAxis unit="%" />
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip content={TooltipContent} />
            {this.state.values.length && (
              <ReferenceArea
                x1={this.state.values[0].date}
                x2={this.state.values[this.state.values.length - 1].date}
                y2={0}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    )
  }

  private getValues(data: FundData[]): any[] {
    if (!data.length) return []

    return data[0].returns.map(({ EndDate, Value }) => {
      return { date: EndDate, [data[0].name]: +Value }
    })
  }
}

const TooltipContent: React.StatelessComponent<any> = props => {
  if (!props.payload || !props.payload.length) return <div />

  const value = props.payload[0].value.toFixed(2)
  const valueClasses = classNames({
    'graph-tooltip__value': true,
    'neg-return': value < 0,
    'pos-return': value > 0
  })

  return (
    <div className="graph-tooltip">
      <div className="graph-tooltip__date">
        {new Date(props.label).toLocaleDateString('en-UK')}
      </div>
      <div className={valueClasses}>
        {value}
        {props.payload[0].unit}
      </div>
    </div>
  )
}

const NoGraphMessage: React.StatelessComponent = () => {
  return <div>No Fund Selected</div>
}

const LoadingSpinner: React.StatelessComponent = () => (
  <div className="loadingspinner" />
)
