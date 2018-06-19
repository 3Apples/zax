import React                            from 'react';
import {NavLink,Route,Switch,Redirect}  from 'react-router-dom';
import OrgList                          from '../components/org/list.jsx';
import OrgAddForm                       from '../components/org/add.jsx';
import OrgDetail                        from '../components/org/detail.jsx';
import Breadcrumbs                      from '../components/misc/breadcrumbs.jsx';
import identity                         from '../common/identity';

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			pug`
				.row
					.col-md-12.col-sm-12.col-xs-12
						if ${this.props.self.scopeAdd('org')}
							.x_panel
								.x_content
									span.fa.fa-plus &nbsp
									NavLink(to='/vc-admin/org/page/add') Add a new Organization
						.x_panel
							.x_content
								h4 Organization List
								OrgList(style={ width:"100%" })
			`);
	}
}

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			loading : true,
			self    : null,
			error   : null
		};
	}

	componentDidMount () {
		var _this = this;

		identity.fetch ()
			.then (
				(user ) => _this.setState({ self  : user, loading : false }),
				(error) => _this.setState({ error : error,loading : false }),
			);
	}

	render () {
		if (this.state.loading)
			return (
				pug`
					div
						span.fa.fa-spinner.fa-spin
						span &nbsp Loading ...
				`
			);

		if (this.state.error)
			return (
				pug`
					.text-danger
						span ${this.state.error}
				`
			);

		var self = this.state.self;

		return (
			pug`
				main
					Switch
						if ${self.scopeView('org')}
							if ${self.isViewScopeSingular('org', '_id')}
								Route(path='/vc-admin/org/page/detail/', component=${OrgDetail})
								Redirect(exact=${true}, from='/vc-admin/org/', to='/vc-admin/org/page/detail/')

							Route(exact=${true}, path='/vc-admin/org/', render=${() => pug`Main(self=${this.state.self})`})

							if ${self.scopeAdd('org')}
								Route(path='/vc-admin/org/page/add', component=${OrgAddForm})

							if ${!self.isViewScopeSingular('org', '_id')}
								Route(path='/vc-admin/org/page/detail/:orgId', component=${OrgDetail})

						Route(path='/vc-admin/org/', render=${() => pug`span Forbidden - no scope for this operation`})
			`
		);
	}
};

export default App;
