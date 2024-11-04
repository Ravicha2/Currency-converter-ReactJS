import React from 'react';
import { json, checkStatus } from './util';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);  // Set date to 1 month ago

    this.state = {
      timeSeries: {},
      today: today.toISOString().split('T')[0],  // Format date as YYYY-MM-DD
      lastMonth: lastMonth.toISOString().split('T')[0],
      error: '',
    };
  }

  componentDidMount() {
    const { baseCurrency, targetCurrency } = this.props.match.params;  // Get params from URL error
    const { lastMonth, today } = this.state;

    // Fetch time series data for the selected currency pair over the past month
    fetch(`https://api.frankfurter.app/${lastMonth}..${today}?from=${baseCurrency}&to=${targetCurrency}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data) {
          this.setState({ timeSeries: data.rates, error: '' });
        } else {
          throw new Error('Failed to fetch data');
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.error('Error fetching time series data:', error);
      });
  }

  render() {
    const { timeSeries, error } = this.state;
    const { baseCurrency, targetCurrency } = this.props.match.params;

    return (
      <div className="container">
        <h2>Time Series for {baseCurrency} to {targetCurrency}</h2>
        {error ? (
          <p>{error}</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(timeSeries).map(([date, rates]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{rates[targetCurrency]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default Graph;
