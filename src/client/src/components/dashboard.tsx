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
        <div className="d-flex justify-content-center search">
          <Search fundNames={this.state.funds} onSearch={this.onSearch} />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center graph">
          <Graph data={this.state.graphData} isLoading={this.state.loading} />
        </div>
      </React.Fragment>
    )
  }

  private getFundData = async (name: string) => {
    this.setState({ loading: true })
    const data = await Api.getByName(name)
    this.setState({ graphData: [data], loading: false })
  }
}
