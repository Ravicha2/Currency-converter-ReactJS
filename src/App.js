import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import MainRate from './table';
import './App.css';
import Conv from './cal'


const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Exchange Table</Link>
        <Link to="/cal">Converter</Link>
      </nav>
      <Switch>
        <Route path="/" exact component={MainRate} />
        <Route path="/cal" component={Conv} />
        <Route component={NotFound} />
      </Switch>
      <footer>
        <p>By Ravicha, Guided by Altcademy</p>
      </footer>
    </Router>
  );
}

export default App;