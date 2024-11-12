import React from 'react';
import { json, checkStatus } from './util';
import Chart from 'chart.js/auto';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1); // Set date to 1 month ago

    this.state = {
      timeSeries: {},
      today: today.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      lastMonth: lastMonth.toISOString().split('T')[0],
      error: '',
    };

    this.chartRef = React.createRef(); // Create a ref for the chart
  }

  componentDidMount() {
    const { baseCurrency, targetCurrency } = this.props.match.params; // Get params from URL
    this.getHistoricalRates(baseCurrency, targetCurrency); // Fetch historical rates
  }

  getHistoricalRates = (base, quote) => {
    const { lastMonth, today } = this.state;
    fetch(`https://api.frankfurter.app/${lastMonth}..${today}?from=${base}&to=${quote}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        const chartLabels = Object.keys(data.rates); // Dates
        const chartData = Object.values(data.rates).map((rate) => rate[quote]); // Rates
        const chartLabel = `${base}/${quote}`;
        this.buildChart(chartLabels, chartData, chartLabel);
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.error('Error fetching historical rates:', error);
      });
  };

  buildChart = (labels, data, label) => {
    if (this.chart) {
      this.chart.destroy(); // Destroy previous chart instance
    }

    this.chart = new Chart(this.chartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Exchange Rate',
            },
          },
        },
      },
    });
  };

  render() {
    const { error } = this.state;
    const { baseCurrency, targetCurrency } = this.props.match.params;

    return (
      <div className="container">
        <h2>Time Series for {baseCurrency} to {targetCurrency}</h2>
        {error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <canvas ref={this.chartRef} /> // Canvas for Chart.js
        )}
      </div>
    );
  }
}

export default Graph;
