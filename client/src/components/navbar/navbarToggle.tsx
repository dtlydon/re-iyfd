import React from 'react';

const NavbarToggle: React.FC = () => (
	<div className="navbar-header">
		<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
			<span className="sr-only">Toggle navigation</span>
			<span className="icon-bar"></span>
			<span className="icon-bar"></span>
			<span className="icon-bar"></span>
		</button>
		<a className="navbar-brand">IYFD 37</a>
	</div>
);

export default NavbarToggle;
