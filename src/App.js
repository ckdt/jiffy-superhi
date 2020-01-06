import React, {Component} from 'react';
import loader from './images/loader.svg';
import Gif from './Gif';
import clearButton from './images/close-icon.svg';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ? <img className="block mx-auto" src={loader} /> : hintText}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: 'Hit enter to search',
      gifs: []
    };
  }
  // async needs await
  searchGiphy = async searchTerm => {
    this.setState({
      loading: true
    });

    // try fetch api
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=M4Cupfqh91N8EH3aBSH0Zx11CGYeQaSf&q=${searchTerm}&limit=25&offset=0&rating=PG&lang=en`
      );

      const {data} = await response.json();
      // check results or throw error
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      // random result
      const randomGif = randomChoice(data);
      console.log(randomGif);

      this.setState((prevState, props) => ({
        ...prevState,
        // get previous gifs, spread and add random gif at the end
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to search more ${searchTerm}`
      }));

      // catch errors
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
      console.log(error);
    }
  };

  handleChange = event => {
    const {value} = event.target;
    this.setState((prevState, props) => ({
      // spread old props and overwrite with value
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

  handleKeyPress = event => {
    const {value} = event.target;

    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value);
    }

    console.log(event.key);
  };

  clearSearch = () => {
    this.setState((prevState, props) => ({
      // spread old props and overwrite with value
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));

    this.textInput.focus();
  };

  render() {
    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length;

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {this.state.gifs.map(gif => (
            // spread all properties onto component
            <Gif {...gif} />
          ))}

          <input
            ref={input => {
              this.textInput = input;
            }}
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
