import Fuse from 'fuse.js'
import debounce from 'lodash.debounce'
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

const MAX_NUM_SUGGESTIONS = 10

export default class Dashboard extends React.Component<
  SearchProps,
  SearchState
> {
  private onSearch: (value: string) => void
  private suggestionProvider: (suggestion: string) => string[]

  constructor(props: SearchProps) {
    super(props)
    this.state = {
      fundNames: props.fundNames,
      searchValue: '',
      suggestions: []
    }

    this.onSearch = props.onSearch

    this.onSuggestionsFetchRequested = debounce(
      this.onSuggestionsFetchRequested,
      1000
    )
    this.suggestionProvider = suggestionProvider(this.state.fundNames)
  }

  public componentWillReceiveProps(props: SearchProps) {
    this.suggestionProvider = suggestionProvider(props.fundNames)
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
    return value.trim().length >= 2
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
    const inputValue = request.value.trim()
    const suggestions = this.suggestionProvider(inputValue)

    this.setState({ suggestions })
  }

  private onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }
}

const Suggestion = (suggestion: string) => <span>{suggestion}</span>

function suggestionProvider(candidates: string[]) {
  const options = {
    distance: 50,
    findAllMatches: false,
    includeMatches: true,
    includeScore: true,
    location: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    shouldSort: true,
    threshold: 0.1,
    tokenize: true
  }

  const fuse = new Fuse(candidates, options)

  return (suggestion: string) => {
    const suggestions: string[] = []
    const results: any[] = fuse.search(suggestion)

    if (!results.length) return suggestions

    while (results.length && suggestions.length < MAX_NUM_SUGGESTIONS) {
      results
        .shift()
        .matches.forEach((match: any) => suggestions.push(match.value))
    }

    return suggestions
  }
}
