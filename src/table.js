import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { json, checkStatus } from './util';

const CurrencyRates = ({ base, date, rates }) => {
  return (
    <div className="row">
      <div className="col-6 col-md-8 col-lg-11 mb-3 mx-3">
          <h2>All {base} Exchange Rate</h2>
          <p>{date}</p>
          <table className='table'>
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
                    <td className='w-33'><Link to={`/graph/${base}/${currency}`}>{rate}</Link></td>
                    <td className='w-25'>{(1 / rate).toFixed(5)}</td>
                </tr>
                ))}
        
        
            </tbody>
        </table>
      </div>
    </div>
  );
};

const Watchlist = () => {
    const [rates, setRates] = useState({});
    const [error, setError] = useState('');
  
    const currencyPairs = {
      "USD": ["AUD", "JPY", "THB"],  
      "AUD": ["THB"],           
      "GBP": ["USD","EUR","THB"]
    };
  
    React.useEffect(() => {
      // Fetch exchange rates for each base currency
      const fetchRates = async () => {
        try {
          
          const usdRates = await fetch(`https://api.frankfurter.app/latest?base=USD`).then(checkStatus).then(json);
          const audRates = await fetch(`https://api.frankfurter.app/latest?base=AUD`).then(checkStatus).then(json);
          const gbpRates = await fetch(`https://api.frankfurter.app/latest?base=GBP`).then(checkStatus).then(json);
  
          
          setRates({
            "USD": usdRates.rates,
            "AUD": audRates.rates,
            "GBP": gbpRates.rates
          });
          setError('');
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchRates();
    }, []);
  
    return (
      <div>
        {error && <p>{error}</p>}
        <h2>Watchlist</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Base</th>
              <th>Target</th>
              <th>Rate</th>
              <th>Inverse Rate</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(currencyPairs).map(([baseCurrency, targetCurrencies]) => (
              targetCurrencies.map((targetCurrency) => {
                const rate = rates[baseCurrency]?.[targetCurrency];
                if (!rate) return null; // Skip if rate is not available
  
                return (
                  <tr key={`${baseCurrency}-${targetCurrency}`}>
                    <td>{baseCurrency}</td>
                    <td>{targetCurrency}</td>
                    <td><Link to={`/graph/${baseCurrency}/${targetCurrency}`}>{rate}</Link></td>
                    <td>{(1 / rate).toFixed(5)}</td> {/* Inverse rate */}
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

class MainRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      selectedCurrency: 'USD',
      result: null,  // Changed to store only a single result object, not an array
      error: '',
    };

    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);

  }

  componentDidMount(){
    fetch(`https://api.frankfurter.app/currencies`).then(checkStatus).then(json)
    .then((data) => {
      this.setState({currencies: Object.keys(data )});
    })
    .catch((error) => {
      this.setState({error:error.message});
    });
    this.fetchRates(this.state.selectedCurrency);
  }
  handleCurrencyChange(event) {
    const selectedCurrency = event.target.value;
    this.setState({ selectedCurrency}, () => {
      this.fetchRates(selectedCurrency)
    });
  };

  fetchRates(baseCurrency) {
    fetch(`https://api.frankfurter.app/latest?base=${baseCurrency}`).then(checkStatus).then(json)
    .then((data) => {
      this.setState({result:data, error: ''});
    })
    .catch((error) => {
      this.setState({error: error.message});
      console.error('Error fetching rate', error);
    });
  }
  render() {
    const { currencies, selectedCurrency, result, error } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-3">
            <form className="form-inline my-4">
              <label htmlFor="currencyDropdown" className="form-label">
                Select Currency:
              </label>
              <select
                id="currencyDropdown"
                className="form-control"
                value={selectedCurrency}
                onChange={this.handleCurrencyChange}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </form>
          </div>
          <div className="col-8 my-4 mx-3">
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
        </div>
        <div className='row mt-3'>
                <Watchlist/>
        </div>
      </div>
    );
  }
}

export default MainRate;
