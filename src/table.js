import React from 'react';
import { Link } from "react-router-dom";
import { json, checkStatus } from './util';

const CurrencyRates = ({ base, date, rates }) => {
  return (
    <div className="row">
      <div className="col-6 col-md-10 col-lg-11 mb-3">
          <h2>All {base} Exchange Rate</h2>
          <p>{date}</p>
          <table>
            <thead>
                <tr>
                    <th>Currency</th>
                    <th>Rate</th>
                    <th>Inv. Rate</th>
                </tr>
            </thead>
            <tbody>
            {Object.entries(rates).map(([currency, rate]) => (
                <tr key = {currency}>
                    <td className='w-33'>{currency}</td>
                    <td className='w-33'>{rate}</td>
                    <td className='w-25'>{(1/rate).toFixed(5)}</td>
                </tr>
                ))}
        
        
            </tbody>
        </table>
      </div>
    </div>
  );
};

class Watchlist extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            list:{},
            error:''
        };
    }
    
    componentDidMount(){
    fetch(`https://api.frankfurter.app/latest?base=USD`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({ list: data.rates, error: '' });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.error(error);
      });
    }
    render () {
        const {list, error} = this.state;
        return (
            <div>
        {error && <p>{error}</p>}
        <h2>Watchlist</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(list).map(([currency, rate]) => (
              <tr key={currency}>
                <td>USD{currency}</td>
                <td>{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        )

    }
    
}

class MainRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      result: null,  // Changed to store only a single result object, not an array
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = searchTerm.trim();
    if (!searchTerm) {
      return;
    }

    fetch(`https://api.frankfurter.app/latest?base=${searchTerm}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({ result: data, error: '' });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.error(error);
      });
  }

  render() {
    const { searchTerm, result, error } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-3">
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2"
                placeholder="USD"
                value={searchTerm}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary mt-2">Submit</button>
            </form>
          </div>
          <div className='col-6'>
          {error ? (
              <p>{error}</p>
            ) : (
              result && (
                <CurrencyRates
                  base={result.base}
                  date={result.date}
                  rates={result.rates}
                />
              )
            )}
          </div>
          <div className="col-3">
            <Watchlist /> 
          </div>
        </div>
        </div>
    );
  }
}

export default MainRate;
