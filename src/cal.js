import React from 'react';
import { json, checkStatus } from './util';
import { Link } from "react-router-dom";


class Conv extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        rate: 0.89,
        usd: 1,
        euro: 1 * 0.89,
      };
    }
  
    toUsd(amount, rate) {
      return amount * (1 / rate);
    }
  
    toEuro(amount, rate) {
      return amount * rate;
    }
  
    render() {
      const { rate, usd, euro } = this.state;
  
      return (
        <div className="container">
          <div className="text-center p-3 mb-2">
            <h2 className="mb-2">Currency Converter</h2>
            <h4>USD 1 : {rate} EURO</h4>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <span className="mr-1">USD</span>
              <input value={usd} onChange={this.handleUsdChange} type="number" />
              <span className="mx-3">=</span>
              <input value={euro} onChange={this.handleEuroChange} type="number" />
              <span className="ml-1">EURO</span>
            </div>
          </div>
        </div>
      )
    }
  }


export default Conv