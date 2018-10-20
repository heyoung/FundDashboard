/* tslint:disable:no-shadowed-variable */

import classNames from 'classnames'
import * as d3 from 'd3'
import { select } from 'd3-selection'
import * as React from 'react'
import { FundData } from '../../../data/fund-data'

interface GraphState {
  data: FundData[]
  isLoading: boolean
  values: any[]
}

interface GraphData {
  value: number
  date: Date
}

interface GraphProps {
  data: FundData[]
  isLoading: boolean
}

export default class Graph extends React.Component<GraphProps, GraphState> {
  private node: SVGSVGElement | null

  constructor(props: GraphProps) {
    super(props)

    this.node = null

    this.state = {
      data: props.data,
      isLoading: props.isLoading,
      values: this.getValues(props.data)
    }
  }

  public componentWillReceiveProps(props: GraphProps) {
    this.setState({ ...props, values: this.getValues(props.data) })
  }

  public componentDidMount() {
    this.createChart()
  }

  public componentDidUpdate() {
    this.createChart()
  }

  public shouldComponentUpdate(nextProps: GraphProps, nextState: GraphState) {
    const graphedFunds = this.state.data.map(d => d.name)

    if (nextProps.isLoading !== this.state.isLoading) return true

    if (!graphedFunds.length && nextProps.data.length) return true

    nextProps.data.forEach(data => {
      if (graphedFunds.indexOf(data.name) < 0) return true
    })

    return false
  }

  public render() {
    const fundNames: string[] = this.state.data.map(d => d.name)

    if (!fundNames.length || this.state.isLoading) {
      return (
        <div className="placeholder">
          {!fundNames.length && !this.state.isLoading && <NoGraphMessage />}
          {this.state.isLoading && <LoadingSpinner />}
        </div>
      )
    }

    return (
      <div className="graph">
        <div className="graph__title">Cumulative Return</div>
        <svg
          className="graph__chart"
          ref={(ref: SVGSVGElement) => (this.node = ref)}
        />
      </div>
    )
  }

  private createChart() {
    const node = this.node

    if (!node) return

    const width = node.clientWidth
    const height = node.clientHeight

    const margin = { top: 20, right: 30, bottom: 50, left: 40 }

    const data = this.getValues(this.state.data)

    const xExtent: any = d3.extent<GraphData, Date>(
      data,
      (d: GraphData) => new Date(d.date)
    )

    const yExtent: any = d3.extent<GraphData, number>(
      data,
      (d: GraphData) => d.value
    )

    const x = d3
      .scaleTime()
      .domain(xExtent)
      .range([margin.left, width - margin.right])

    const y = d3
      .scaleLinear()
      .domain(yExtent)
      .nice()
      .range([height - margin.bottom, margin.top])

    const xAxis = (g: any) =>
      g
        .attr('class', 'xaxis')
        .attr('transform', `translate(0,${+height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(+width / 80)
            .tickSizeOuter(0)
        )

    const yAxis = (g: any) =>
      g
        .attr('class', 'yaxis')
        .attr('transform', `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(y)
            .ticks(10)
            .tickFormat(t => t + '%')
        )
        .call((g: any) => g.select('.domain').remove())
        .call((g: any) =>
          g
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 5)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
        )

    const line = d3
      .line<GraphData>()
      .defined(d => !isNaN(d.value))
      .x(d => x(d.date))
      .y(d => y(d.value))

    select(node)
      .append('g')
      .call(xAxis)

    select(node)
      .append('g')
      .call(yAxis)

    select(node)
      .append('line')
      .attr('id', 'zeroLine')
      .attr(
        'x1',
        x(
          d3.min<GraphData, any>(data, (d: GraphData): Date => new Date(d.date))
        )
      )
      .attr(
        'x2',
        x(
          d3.max<GraphData, any>(data, (d: GraphData): Date => new Date(d.date))
        )
      )
      .attr('y1', y(0))
      .attr('y2', y(0))

    select(node)
      .append('path')
      .datum<GraphData[]>(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line)
  }

  private getValues(data: FundData[]): GraphData[] {
    if (!data.length) return []

    return data[0].returns.map(({ EndDate, Value }) => {
      return { date: new Date(EndDate), value: +Value }
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

const NoGraphMessage: React.StatelessComponent = () => (
  <div> No Fund Selected </div>
)

const LoadingSpinner: React.StatelessComponent = () => (
  <div className="loadingspinner" />
)
