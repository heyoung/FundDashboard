import * as React from 'react'
import Autosuggest from 'react-autosuggest'
import { ChangeEvent, SuggestionsFetchRequestedParams } from 'react-autosuggest'

interface SearchState {
  fundNames: string[]
  suggestions: string[]
  searchValue: string
}

interface SearchProps {
  fundNames: string[]
  onSearch: () => void
}

export default class Dashboard extends React.Component<
  SearchProps,
  SearchState
> {
  private onSearch: (value: string) => void

  constructor(props: SearchProps) {
    super(props)
    this.state = {
      fundNames: props.fundNames,
      searchValue: '',
      suggestions: []
    }

    this.onSearch = props.onSearch
  }

  public componentWillReceiveProps(props: SearchProps) {
    this.setState({ fundNames: props.fundNames })
  }

  public render() {
    const suggestionInputProp = {
      onChange: this.onChange,
      placeholder: 'Enter Fund Name',
      value: this.state.searchValue
    }

    return (
      <div className="search__container">
        <Autosuggest
          suggestions={this.state.suggestions}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          inputProps={suggestionInputProp}
          renderSuggestion={Suggestion}
        />
      </div>
    )
  }

  private shouldRenderSuggestions(value: string) {
    return value.trim().length > 3
  }

  private getSuggestionValue(value: string) {
    return value
  }

  private onChange = (event: React.FormEvent<any>, params: ChangeEvent) => {
    this.setState({ searchValue: params.newValue })
    this.onSearch(params.newValue)
  }

  private onSuggestionsFetchRequested = (
    request: SuggestionsFetchRequestedParams
  ): void => {
    const inputValue = request.value.trim().toLowerCase()

    const suggestions = this.state.fundNames.filter((suggestion: string) => {
      return suggestion.toLocaleLowerCase().includes(inputValue)
    })

    this.setState({ suggestions })
  }

  private onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }
}

const Suggestion = (suggestion: string) => <span>{suggestion}</span>
