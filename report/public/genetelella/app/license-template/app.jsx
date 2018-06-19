import React                   from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import LicTemplateList         from '../components/license-template/list.jsx';
import LicTemplateAddForm      from '../components/license-template/add.jsx';
import LicTemplateDetail       from '../components/license-template/detail.jsx';

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
								Link(to='/vc-admin/lic/template/add-page') Add a new License Archetype
						.x_panel
							.x_content
								h4 License Archetype List
								LicTemplateList(style={ width:"100%" })
			`);
	}
}

var App = () => (
	<main>
		<Switch>
			<Route exact path='/vc-admin/lic/template' component={Main}/>
			<Route path='/vc-admin/lic/template/add-page' component={LicTemplateAddForm}/>
			<Route path='/vc-admin/lic/template/detail/page/:_id' component={LicTemplateDetail}/>
		</Switch>
	</main>
);

export default App;

