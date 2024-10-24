import React from 'react';
import { json, checkStatus } from './util';
import { Link } from "react-router-dom";


class Conv extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        rate: 1,
        leftVal: 1,
        rightVal: 1,
        baseCurrency: "USD",
        targetCurrency: "EUR",
        currencies: [], //currencies list
      };
    }
    fetchCurrencies() {
        fetch(`https://api.frankfurter.app/currencies`).then(checkStatus).then(json)
        .then(data => {
            const currencies = Object.keys(data);
            this.setState({currencies});
        })
        .catch(error => console.error('Error fetching currency list:', error));
    }
    fetchRate(baseCurrency, targetCurrency) {
        fetch(`https://api.frankfurter.app/latest?base=${baseCurrency}&symbols=${targetCurrency}`).then(checkStatus).then(json)
        .then(data => {
            const rate = data.rates[targetCurrency];
             this.setState({
                rate, 
                rightVal: this.toRight(this.state.leftVal, rate),});
        })
        .catch(error => console.log('Error fetching exchange rate', error))
    }
    handlingLeftValChange = (e) => {
        const leftVal = e.target.value;
        this.setState({
            leftVal,
            rightVal: this.toRight(leftVal,this.state.rate),
        });
    };
    handlingRightValChange = (e) => {
        const rightVal = e.target.value;
        this.setState({
            leftVal: this.toLeft(rightVal,this.state.rate),
            rightVal,
        });
    };
    handlingBaseCur = (currency) => {
        this.setState(
            {baseCurrency:currency}, 
            () => this.fetchRate(currency, this.state.targetCurrency)
            );
    };
    handlingTargetCur = (currency) => {
        this.setState(
            {targetCurrency: currency},
            () => this.fetchRate(this.state.baseCurrency, currency)
        );
    };
    toLeft(amount, rate) {
      return amount * (1 / rate);
    }
  
    toRight(amount, rate) {
      return amount * rate;
    }
    componentDidMount() {
        this.fetchCurrencies();
        this.fetchRate(this.state.baseCurrency, this.state.targetCurrency);
    }

    render() {
      const { rate, leftVal, rightVal, baseCurrency, targetCurrency, currencies } = this.state;
  
      return (
        <div className="container">
          <div className="text-center p-3 mb-2">
            <h2 className="mb-2">Currency Converter</h2>
            <h4>{baseCurrency} 1 : {rate} {targetCurrency}</h4>
          </div>

          <div className="row">
          <div class="dropdown dropstart col-3 text-center">
            <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                   Currency
            </button>
            <ul class="dropdown-menu">
                {currencies.map(currency => (
                    <li key = {currency}>                                
                        <button className='dropdown-item' onClick={() => this.handlingBaseCur(currency)}>{currency}</button>
                    </li>
                ))}
            </ul>
          </div>

        <div className="col-6 text-center">
            <input
                value={leftVal}
                onChange={this.handlingLeftValChange}
                type='number'
                className='form-control'
            />
            <span className='mx-4'>=</span>
            <input
                value={rightVal}
                onChange={this.handlingRightValChange}
                type='number'
                className='form-control'
            />
        </div>

        <div class="dropdown dropend col-3 text-center">
            <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                   Currency                
            </button>
            <ul class="dropdown-menu">
                {currencies.map(currency => (
                    <li key = {currency}>                                
                        <button className='dropdown-item' onClick={() => this.handlingTargetCur(currency)}>{currency}</button>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    </div>
      )
    }
  }


export default Conv