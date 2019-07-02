import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/navbar';
import Configuration from './common/configuration';

const App: React.FC = () => {
  return (
	<div className="re-iyfd">
		<Router>
			<Navbar />
			<div className="container">
				{Configuration.routeContents.map(({path, component, isExact}) => (
					<Route exact={isExact} key={path} path={path} component={component} />
				))}
			</div>
		</Router>
	</div>
  );
}

export default App;
