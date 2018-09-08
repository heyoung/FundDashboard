import * as React from 'react'
import Graph from './graph'
import Search from './search'

export class Dashboard extends React.Component<{}, {}> {
  public render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-center search">
          <Search />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center graph">
          <Graph />
        </div>
      </React.Fragment>
    )
  }
}
