import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import MainRate from './table';
import Graph from './graph';
import './App.css';
import Conv from './cal'

const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

const App = () => {
  return (
    <Router basename="/Currency-converter-ReactJS">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Exchange Table</Link>
        <Link className="navbar-brand" to="/cal">Converter</Link>
      </nav>
      <Switch>
        <Route path="/" exact component={MainRate} />
        <Route path="/cal" component={Conv} />
        <Route path="/graph/:baseCurrency/:targetCurrency" component={Graph} />
        <Route component={NotFound} />
      </Switch>
      <footer>
        <p>By <a href="https://comforting-semifreddo-eba349.netlify.app">Ravicha</a>, Guided by <a href="https://www.altcademy.com">Altcademy</a></p>
      </footer>
    </Router>
  );
}

export default App;
