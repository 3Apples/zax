import React                       from 'react';
import { NavLink, Route, Switch }  from 'react-router-dom';
import { Breadcrumbs, Breadcrumb } from 'react-breadcrumbs';

var MyBreadCrumbs = () => (
	<div className="row">
		<div className="col-md-12 col-sm-12 col-xs-12">
			<div className="x_panel">
				<div className="x_content">
					<Breadcrumbs separator=' > '/>
				</div>
			</div>
		</div>
	</div>
);

export default MyBreadCrumbs;
