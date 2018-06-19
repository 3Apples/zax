import React                from 'react';
import {Link,Route,Switch}  from 'react-router-dom';
import RolesList            from '../components/roles/list.jsx';
import RolesListForm        from '../components/roles/add.jsx';
import RolesEditForm        from '../components/roles/edit.jsx';
import RolesDetail          from '../components/roles/detail.jsx';

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			pug`
				.row
					.col-md-12.col-sm-12.col-xs-12
						.x_panel
							.x_content
								span.fa.fa-plus &nbsp
								Link(to='/vc-admin/roles/add/page') Add a new Role
						.x_panel
							.x_content
								h4 Roles List
								RolesList(style={ width:"100%" })
			`);
	}
}

var App = () => (
	<main>
		<Switch>
			<Route exact path='/vc-admin/roles/' component={Main}/>
			<Route path='/vc-admin/roles/add/page' component={RolesListForm}/>
			<Route path='/vc-admin/roles/edit/page/:role_id' component={RolesEditForm}/>
			<Route path='/vc-admin/roles/detail/page/:role_id' component={RolesDetail}/>
		</Switch>
	</main>
);

export default App;
