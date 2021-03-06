import * as React from 'react'
import { Line } from 'react-chartjs-2'
import { FundData } from '../../../data/fund-data'
import ColourProvider from '../modules/ColourProvider'

interface PointData {
  y: number
  t: Date
}

interface GraphProps {
  colourProvider: ColourProvider
  data: FundData[]
  isLoading: boolean
}

export default class Graph extends React.Component<GraphProps> {
  public render() {
    this.padData(this.props.data)

    const data = {
      datasets: this.props.data.map(fundData => {
        const colour = this.props.colourProvider.get(fundData.isin)

        return {
          borderCapStyle: 'butt',
          borderColor: colour,
          borderJoinStyle: 'miter',
          borderWidth: 2,
          data: this.getValues(fundData),
          fill: false,
          label: fundData.name,
          lineTension: 0.1,
          pointBackgroundColor: '#fff',
          pointBorderColor: colour,
          pointBorderWidth: 1,
          pointHitRadius: 10,
          pointHoverBackgroundColor: colour,
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointHoverRadius: 5,
          pointRadius: 1
        }
      })
    }

    const options = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              fontSize: 16
            },
            time: {
              unit: 'quarter'
            },
            type: 'time'
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              callback: (value: string) => {
                return `${value}%`
              },
              fontSize: 16
            }
          }
        ]
      },
      title: {
        display: true,
        fontSize: 20,
        text: 'Cumulative Return'
      },
      tooltips: {
        bodyFontSize: 16,
        callbacks: {
          label: (tooltipItem: any, chartData: any) => {
            let label = chartData.datasets[tooltipItem.datasetIndex].label || ''

            if (label) {
              label += ': '
            }

            label += `${tooltipItem.yLabel.toFixed(2)}%`

            return label
          },
          title: (tooltipItems: any, chartData: any) => {
            return new Date(tooltipItems[0].xLabel).toLocaleDateString('en-gb')
          }
        },
        mode: 'nearest',
        titleFontSize: 16
      }
    }

    const fundNames: string[] = this.props.data.map(d => d.name)

    if (!fundNames.length || this.props.isLoading) {
      return (
        <div className="placeholder">
          {!fundNames.length && !this.props.isLoading && <NoGraphMessage />}
          {this.props.isLoading && <LoadingSpinner />}
        </div>
      )
    }

    return (
      <div className="graph">
        <Line data={data} options={options} />
      </div>
    )
  }

  private getValues(data: FundData): PointData[] {
    return data.returns.map<PointData>(({ EndDate, Value }) => {
      return { t: new Date(EndDate), y: +Value }
    })
  }

  private padData(data: FundData[]): void {
    if (!data.length || data.length === 1) return

    const maxNumReturns = Math.max(...data.map(d => d.returns.length))
    const maxReturns = data.find(d => {
      return d.returns.length === maxNumReturns
    })!.returns

    for (const fundData of data) {
      if (fundData.returns.length === maxNumReturns) continue

      const delta = maxNumReturns - fundData.returns.length

      for (let i = delta - 1; i >= 0; i--) {
        fundData.returns.unshift({ EndDate: maxReturns[i].EndDate, Value: '0' })
      }
    }
  }
}

const NoGraphMessage: React.StatelessComponent = () => (
  <div> No Fund Selected </div>
)

const LoadingSpinner: React.StatelessComponent = () => (
  <div className="loadingspinner" />
)
