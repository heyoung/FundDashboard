import debounce from 'lodash.debounce'
import * as React from 'react'
import { FundData } from '../../../data/fund-data'
import Api from '../api'
import ColourProvider from '../modules/ColourProvider'
import FundDetails from './fund-details'
import Graph from './graph'
import Search from './search'

/**
 * TODO:
 *  - Graceful handling api error responses
 */

interface DashboardState {
  colourProvider: ColourProvider
  funds: string[]
  loading: boolean
  selectedFundData: FundData[]
}

export class Dashboard extends React.Component<{}, DashboardState> {
  private onSearch: any
  private MAX_NUM_FUNDS_COMPARED: number

  constructor(props: {}) {
    super(props)
    this.onSelectedFundRemoved.bind(this)

    this.state = {
      colourProvider: new ColourProvider(),
      funds: [],
      loading: false,
      selectedFundData: []
    }

    this.MAX_NUM_FUNDS_COMPARED = 3

    this.onSearch = debounce(this.getFundData, 1000)
  }

  public async componentDidMount() {
    const funds = await Api.getFundNames()
    this.setState({ funds })
  }

  public render() {
    const details = this.state.selectedFundData.map(d => {
      return {
        colour: this.state.colourProvider.get(d.isin),
        isin: d.isin,
        name: d.name
      }
    })

    return (
      <React.Fragment>
        <div className="d-flex justify-content-center header">
          <Search fundNames={this.state.funds} onSearch={this.onSearch} />
        </div>
        <div className="d-flex flex-column body">
          <FundDetails
            details={details}
            onRemoved={this.onSelectedFundRemoved}
          />
          <Graph
            colourProvider={this.state.colourProvider}
            data={this.state.selectedFundData}
            isLoading={this.state.loading}
          />
        </div>
      </React.Fragment>
    )
  }

  private onSelectedFundRemoved = (isin: string) => {
    this.setState(state => {
      return {
        selectedFundData: state.selectedFundData.filter(d => d.isin !== isin)
      }
    })
  }

  private getFundData = async (name: string) => {
    if (
      !name ||
      this.state.funds.indexOf(name) < 0 ||
      this.state.selectedFundData.length >= this.MAX_NUM_FUNDS_COMPARED ||
      this.state.selectedFundData.find(d => d.name === name)
    ) {
      return
    }

    this.setState({ loading: true })

    const data = await Api.getByName(name)

    if (Object.keys(data).length) {
      this.setState(state => {
        return {
          loading: false,
          selectedFundData: state.selectedFundData.concat([data])
        }
      })
    } else {
      this.setState({ loading: false })
    }
  }
}
