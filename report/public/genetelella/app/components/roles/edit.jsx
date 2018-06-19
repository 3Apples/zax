import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import xhr         from '../../common/xhr';
import Input       from '../misc/input-form-group.jsx';
import Checkboxes  from '../misc/checkbox.jsx';
import Radios      from '../misc/radio.jsx';
import PermsWidget from './perms-widget.jsx';
import '../../less/misc.less';
import './roles.less';

class RolesEditForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loading                 : 'init',
			loadingErr              : null,
			xhrStatus               : 'init',
			errorString             : null,
			submitEnabled           : false,
			role                    : null,
		};

		this.check       = this.check.bind(this);
		this.submit      = this.submit.bind(this);
	}

	hasValue (item) {
		return item && item.length;
	}

	toggleSubmit () {

		if (this.hasValue (this.state.role.name)) {
			this.setState ({ submitEnabled : true });
			return;
		}

		this.setState ({ submitEnabled : false });
	}

	check (role) {
		this.setState ({
			role       : role,
			xhrStatus  : 'init',
			loadingErr : ''
		}, this.toggleSubmit);
	}

	componentDidMount () {
		var _this = this;

		this.setState ({ loading : 'loading', loadingErr : null }, () => {
			xhr.get ('/vc-admin/roles/detail/' + this.props.match.params.role_id)
				.then ((data) => {
					_this.setState ({ loading : 'done', role : data, submitEnabled : true });
				})
				.fail ((err) => {
					_this.setState({ loading : 'error', loadingErr : err, role : null });
				});
		});
	}

	submit (event) {
		event.preventDefault();
		var _this = this;

		if (!this.state.submitEnabled)
			return;

		this.setState({ submitEnabled : false, xhrStatus : 'submitting', errorString : null }, function () {

			var data = this.state.role;
			xhr.post ('/vc-admin/roles/edit/' + data._id, data)
				.then (() => {
					_this.setState({ submitEnabled : true, xhrStatus : 'success', errorString : null });

					if (this.props.callback)
						return this.props.callback (null, this.state);
				})
				.fail ((err) => {
					_this.setState({ submitEnabled : true, xhrStatus : 'error', errorString : err });
				});
		});
	}

	render() {
		return (
			pug`
				.row
					.col-lg-10.col-md-12.col-sm-12.col-xs-12
						.x_panel
							.x_content
								h4 Edit Role
								if ${this.state.loading === 'loading'}
									p
										span.fa.fa-spinner.fa-spin
										| &nbsp Loading details ...
								if ${this.state.loadingErr}
									p.text-danger ${this.state.loadingErr}

								if ${this.state.loading === 'done'}
									PermsWidget(
										callback=${this.check},
										role=${this.state.role}
									)

									if ${this.state.submitEnabled}
										button.btn.btn-info(onClick=${this.submit}) Submit
									else
										button.btn.btn-info(disabled) Submit

									if ${this.state.xhrStatus === 'submitting'}
										span.fa.fa-spinner.fa-spin
										span &nbsp Submitting request ...

									if ${this.state.xhrStatus === 'success'}
										.text-success
											span Role &nbsp
												b ${this.state.role.name}
											span &nbsp updated ok.

									if ${this.state.errorString}
										.text-danger
											span ${this.state.errorString}
			`
		);
	}
}

export default RolesEditForm;
