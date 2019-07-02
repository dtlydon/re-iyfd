import React from 'react';
import NavbarToggle from './navbarToggle';
import NavbarContents from './navbarContents';

const Navbar: React.FC = () => (
	<nav className="navbar navbar-fixed-top navbar-inverse">
		<div className="container">
			<NavbarToggle />
			<NavbarContents />
		</div>
	</nav>
);

export default Navbar;
