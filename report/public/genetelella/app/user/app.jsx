import React                from 'react';
import {Link,Route,Switch,Redirect}  from 'react-router-dom';
import UserList             from '../components/user/list.jsx';
import UserAddForm 	        from '../components/user/add.jsx';
import UserEditForm         from '../components/user/edit.jsx';
import UserDetail           from '../components/user/detail.jsx';
import identity             from '../common/identity';

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			pug`
				.row
					.col-md-12.col-sm-12.col-xs-12
						if ${this.props.self.scopeAdd('users')}
							.x_panel
								.x_content
									span.fa.fa-plus &nbsp
									Link(to='/vc-admin/user/add/page') Add a new User
						.x_panel
							.x_content
								h4 User List
								UserList(style={ width:"100%" }, self=${this.props.self})
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
			)
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
						if ${self.scopeView('users')}
							if ${self.isViewScopeSingular('users', 'id')}
								Redirect(exact=${true}, from='/vc-admin/user/', to='/vc-admin/user/page/detail')

							Route(exact=${true}, path='/vc-admin/user/', render=${() => pug`Main(self=${this.state.self})`})

							if ${self.scopeAdd('users')}
								Route(path='/vc-admin/user/add/page', component=${UserAddForm})

							if ${self.scopeEdit('users')}
								Route(path='/vc-admin/user/edit/page/:user_id', component=${UserEditForm})

							Route(path='/vc-admin/user/page/detail', component=${UserDetail})

							if ${!self.isViewScopeSingular('users', 'id')}
								Route(path='/vc-admin/user/detail/page/:user_id', component=${UserDetail})

						Route(path='/vc-admin/user/', render=${() => pug`span Forbidden - no scope for this operation`})
			`
		);
	}
};

export default App;
