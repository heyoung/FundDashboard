import debounce from 'lodash.debounce'
import * as React from 'react'
import { FundData } from '../../../data/fund-data'
import Api from '../api'
import Graph from './graph'
import Search from './search'

interface DashboardState {
  graphData: FundData[] | []
  funds: string[]
  loading: boolean
}

export class Dashboard extends React.Component<{}, DashboardState> {
  private onSearch: any

  constructor(props: {}) {
    super(props)

    this.state = {
      funds: [],
      graphData: [],
      loading: false
    }

    this.onSearch = debounce(this.getFundData, 1000)
  }

  public async componentDidMount() {
    const funds = await Api.getFundNames()
    this.setState({ funds })
  }

  public render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-center header">
          <Search fundNames={this.state.funds} onSearch={this.onSearch} />
        </div>
        <div className="d-flex flex-column body">
          <FundDetails
            fund={this.state.graphData[0]}
            loading={this.state.loading}
          />
          <Graph data={this.state.graphData} isLoading={this.state.loading} />
        </div>
      </React.Fragment>
    )
  }

  private getFundData = async (name: string) => {
    if (!name) return

    if (this.state.funds.indexOf(name) < 0) return

    this.setState({ loading: true })
    const data = await Api.getByName(name)

    if (Object.keys(data).length) {
      this.setState({ graphData: [data], loading: false })
    } else {
      this.setState({ loading: false })
    }
  }
}

const FundDetails: React.StatelessComponent<{
  fund: FundData
  loading: boolean
}> = ({ fund, loading }) => {
  if (!fund || loading) return null

  return (
    <div className="funddata">
      <div className="funddata__container">
        <div className="funddata__title">{fund.name}</div>
        <div className="funddata__isin">ISIN: {fund.isin}</div>
      </div>
      <hr className="funddata__rule" />
    </div>
  )
}
