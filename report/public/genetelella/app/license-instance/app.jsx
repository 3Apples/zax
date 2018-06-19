import React                   from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import LicInstanceList         from '../components/license-instance/list.jsx';
import LicInstanceAddForm      from '../components/license-instance/add.jsx';
import LicInstanceDetail       from '../components/license-instance/detail.jsx';

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
								Link(to='/vc-admin/lic/instance/add-page') Add a new License Instance
						.x_panel
							.x_content
								h4 License Instance List
								LicInstanceList(style={ width:"100%" })
			`);
	}
}

var App = () => (
	<main>
		<Switch>
			<Route exact path='/vc-admin/lic/instance' component={Main}/>
			<Route path='/vc-admin/lic/instance/add-page' component={LicInstanceAddForm}/>
			<Route path='/vc-admin/lic/instance/detail/page/:id' component={LicInstanceDetail}/>
		</Switch>
	</main>
);

export default App;
