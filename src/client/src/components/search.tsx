import * as React from 'react'
import Autosuggest from 'react-autosuggest'
import { ChangeEvent, SuggestionsFetchRequestedParams } from 'react-autosuggest'
import Api from '../api'

interface SearchState {
  suggestions: string[]
  searchValue: string
}

export default class Dashboard extends React.Component<{}, SearchState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      searchValue: '',
      suggestions: []
    }
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
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          inputProps={suggestionInputProp}
          renderSuggestion={Suggestion}
        />
      </div>
    )
  }

  private getSuggestionValue(value: string) {
    return value
  }

  private onChange = (event: React.FormEvent<any>, params: ChangeEvent) => {
    this.setState({ searchValue: params.newValue })
  }

  private onSuggestionsFetchRequested = (
    request: SuggestionsFetchRequestedParams
  ): void => {
    if (!this.state.suggestions.length) {
      this.loadSuggestions(request.value)
    }
  }

  private onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  private async loadSuggestions(value: string): Promise<void> {
    const names = await Api.getFundNames()
    this.setState({ suggestions: names })
  }
}

const Suggestion = (suggestion: string) => <span>{suggestion}</span>
