import React, { Component } from 'react';
import './App.css';
import { selectRequestData, selectRequestStatus } from './stateManager';
import { stateProvider } from './state';
import { fetchData, FETCH_DATA } from './actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: 0 };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({selected: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.fetch(parseInt(this.state.selected))
  }
  render() {
    const { current, result, isRequestPending } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <p>
            {`The current number is ${current}`}
          </p>
          <p>
            {`The final result is ${result}`}
          </p>
          <form onSubmit={this.handleSubmit}>
            <select value={this.state.selected} onChange={this.handleChange}>
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
            <button onClick={this.handleSubmit} disabled={isRequestPending} >
              {isRequestPending ? 'Calculating...' : 'Plus X+1+2+3'}
            </button>
          </form>
        </header>
      </div>
    );
  }
}

const injectProviderProps = (state, dispatch) => ({
  fetch: (num) => dispatch(fetchData(num)),
  current: state.currentNumber,
  result: selectRequestData(state, FETCH_DATA) || 'Waiting...',
  isRequestPending: selectRequestStatus(state, FETCH_DATA) === 'pending',
})

export default stateProvider(App, injectProviderProps);
