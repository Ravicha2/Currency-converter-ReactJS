import React from 'react';
import { json, checkStatus } from './util';
import { Link } from "react-router-dom";


class Conv extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        rate: 0.89,
        leftCur: 1,
        rightCur: 1 * 0.89,
      };
    }
    
    toLeft(amount, rate) {
      return amount * (1 / rate);
    }
  
    toRight(amount, rate) {
      return amount * rate;
    }
  
    render() {
      const { rate, leftCur, rightCur } = this.state;
  
      return (
        <div className="container">
          <div className="text-center p-3 mb-2">
            <h2 className="mb-2">Currency Converter</h2>
            <h4>USD 1 : {rate} EURO</h4>
          </div>
          <div className="row">
          <div class="dropdown dropstart col-3 text-center">
                    <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                        Currency
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Normal</a></li>
                        <li><a class="dropdown-item active" href="#">Active</a></li>
                        <li><a class="dropdown-item disabled" href="#">Disabled</a></li>
                    </ul>
                </div>
            <div className="col-6 text-center">
                <input value={leftCur} onChange={this.handleUsdChange} type="number" />
                <span className="mx-3">=</span>
                <input value={rightCur} onChange={this.handleEuroChange} type="number" />
            </div>
            <div class="dropdown dropend col-3">
                    <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                        Currency
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Normal</a></li>
                        <li><a class="dropdown-item active" href="#">Active</a></li>
                        <li><a class="dropdown-item disabled" href="#">Disabled</a></li>
                    </ul>
                </div>
          </div>
        </div>
      )
    }
  }


export default Conv