import * as React from 'react'

interface Detail {
  name: string
  isin: string
}

interface FundDetailProps extends Detail {
  isLoading: boolean
  onRemoved: (isin: string) => void
}

interface Props {
  details: Detail[]
  isLoading: boolean
  onRemoved: (isin: string) => void
}

export default class FundDetails extends React.Component<Props, {}> {
  public render() {
    return (
      <div className="fund-details d-flex justify-content-start">
        {this.props.details.map((d: Detail) => {
          return (
            <FundDetail
              key={d.isin}
              {...d}
              isLoading={this.props.isLoading}
              onRemoved={this.props.onRemoved}
            />
          )
        })}
      </div>
    )
  }
}

const FundDetail: React.SFC<FundDetailProps> = props => {
  if (props.isLoading) return null

  const onRemoved = () => props.onRemoved(props.isin)

  return (
    <div className="funddetail flex-grow-1 d-flex">
      <div className="funddetail__title flex-grow-1 align-self-center">
        {props.name}
      </div>
      <i
        className="funddetail__remove fas fa-times flex-shrink-1 align-self-center"
        onClick={onRemoved}
      />
    </div>
  )
}
