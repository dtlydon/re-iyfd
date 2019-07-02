import React from 'react';
import {Route, Link} from 'react-router-dom';
import Configuration from '../../common/configuration';

const Admin: React.FC = () => (
	<div className="admin">
		Admin!
		{
			Configuration.adminRoutes.map(({path, label}) => <li><Link key={path} to={path}>{label}</Link></li>)
		}
		{
			Configuration.adminRoutes.map(({path, component, isExact}) => (
				<Route exact={isExact} key={path} path={path} component={component} />
		))}
	</div>
);

export default Admin;
