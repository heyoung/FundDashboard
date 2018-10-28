/* tslint:disable:no-shadowed-variable */

import * as d3 from 'd3'
import { select } from 'd3-selection'
import * as React from 'react'
import ReactDOM from 'react-dom'
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

    const linePlot = select(node)
      .append('path')
      .datum<GraphData[]>(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line)

    const toolTip = select(node)
      .append('g')
      .attr('class', 'graph-tooltip')
      .style('display', 'none')

    const toolTipNode: any = toolTip.node()

    linePlot
      .on('mouseover', () => {
        toolTip.style('display', null)
      })
      .on('mouseout', () => {
        toolTip.style('display', 'none')
      })
      .on('mousemove', mousemove)

    const bisectDate = d3.bisector<GraphData, any>(d => d.date).left

    function mousemove() {
      const x0: Date = x.invert(d3.event.offsetX)

      const i: number = bisectDate(data, x0, 1)

      const d0: GraphData = data[i - 1]
      const d1: GraphData = data[i]

      const d: GraphData = +x0 - +d0.date > +d1.date - +x0 ? d1 : d0

      ReactDOM.render<React.StatelessComponent>(
        <Tooltip
          date={d.date}
          value={d.value}
          x={d3.event.offsetX}
          y={d3.event.offsetY}
          graphDimensions={{ width, height }}
        />,
        toolTipNode
      )
      toolTip.attr(
        'transform',
        'translate(' + x(d.date) + ',' + y(d.value) + ')'
      )
    }
  }

  private getValues(data: FundData[]): GraphData[] {
    if (!data.length) return []

    return data[0].returns.map(({ EndDate, Value }) => {
      return { date: new Date(EndDate), value: +Value }
    })
  }
}

const Tooltip: React.StatelessComponent<{
  date: Date
  value: number
  x: number
  y: number
  graphDimensions: { width: number; height: number }
}> = props => {
  const width = 100
  const height = 100

  const arrowHeight = 20
  const arrowWidth = 20

  const value = `${props.value.toFixed(2)}%`
  const valueStyleClass = `graph-tooltip__value-${
    props.value < 0 ? 'negative' : 'positive'
  }`

  // TODO: rotate to side if too close to min/max width of graph to prevent overflow. Tooltip should always be in graph area

  const tooltipTranslationY =
    props.graphDimensions.height - props.y < height
      ? -arrowHeight - height
      : arrowHeight

  const arrowRotation =
    props.graphDimensions.height - props.y < height ? 0 : 180

  const arrowTranslationY =
    props.graphDimensions.height - props.y < height ? height : 0

  return (
    <g transform={`translate(${-width / 2}, ${tooltipTranslationY})`}>
      <rect width={`${width}px`} height={`${height}px`} rx="5" ry="5" />
      <polygon
        points="10,0  30,0  20,10"
        transform={`translate(${width / 2 - arrowWidth}, ${arrowTranslationY}) 
        rotate(${arrowRotation}, 20, 0)`}
      />
      <text transform={'translate(50, 45)'}>
        <tspan className="graph-tooltip__date" x="0" textAnchor="middle">
          {props.date.toLocaleDateString('en')}
        </tspan>
        <tspan className={valueStyleClass} x="0" textAnchor="middle" dy="25">
          {value}
        </tspan>
      </text>
    </g>
  )
}

const NoGraphMessage: React.StatelessComponent = () => (
  <div> No Fund Selected </div>
)

const LoadingSpinner: React.StatelessComponent = () => (
  <div className="loadingspinner" />
)
