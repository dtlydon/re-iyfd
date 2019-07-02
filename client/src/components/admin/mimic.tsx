import React from 'react';

const Mimic: React.FC<any> = ({match}) => (
	<div>Mimic {match.parameters.userId}</div>
)

export default Mimic;
