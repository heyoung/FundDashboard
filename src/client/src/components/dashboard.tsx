import * as React from 'react'
import Graph from './graph'
import Search from './search'

export class Dashboard extends React.Component<{}, {}> {
  public render() {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center search">
          <div className="col-8">
            <Search />
          </div>
        </div>
        <Graph />
      </div>
    )
  }
}
