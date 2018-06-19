import React                   from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import ClassList               from './list.jsx';
import ClassAddForm            from './add.jsx';
import ClassDetail             from './detail.jsx';
import identity                from '../common/identity';

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			pug`
				.row
					.col-md-12.col-sm-12.col-xs-12
						if ${this.props.self.scopeAdd('presentations')}
							.x_panel
								.x_content
									span.fa.fa-plus &nbsp
									Link(to='/vc-admin/class/create-page') Create a new Presentation
						.x_panel
							.x_content
								ClassList(style={ width:"100%" })
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
						if ${self.scopeView('presentations')}

							Route(exact=${true}, path='/vc-admin/home', render=${() => pug`Main(self=${this.state.self})`})
							Route(path='/vc-admin/class/detail-page/:class_id', component=${ClassDetail})

							if ${self.scopeAdd('presentations')}
								Route(path='/vc-admin/class/create-page', component=${ClassAddForm})

						Route(path='/vc-admin/', render=${() => pug`span Forbidden - no scope for this operation`})
			`
		);
	}
};
export default App;
