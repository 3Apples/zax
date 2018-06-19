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

class RolesAddForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			xhrStatus               : 'init',
			errorString             : null,
			submitEnabled           : false,
			role                    : {
				name     : '',
				perms    : {
					org  : {
						scope : { _id : null },
						add   : { allowed : false },
						edit  : { allowed : false },
						remove: { allowed : false },
						view  : { allowed : false }
					},
					presentations : {
						scope : { org : null, createdBy : null },
						add   : { allowed : false },
						edit  : { allowed : false },
						remove: { allowed : false },
						view  : { allowed : false }
					},
					users  : {
						scope : { orgId : null },
						add   : { allowed : false },
						edit  : { allowed : false },
						remove: { allowed : false },
						view  : { allowed : false }
					},
					roles  : {
						scope : { _id : null },
						add   : { allowed : false },
						edit  : { allowed : false },
						remove: { allowed : false },
						view  : { allowed : false }
					},
				},
			},
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
		this.setState ({ role : role }, this.toggleSubmit);
	}

	submit (event) {
		event.preventDefault();
		var _this = this;

		if (!this.state.submitEnabled)
			return;

		this.setState({ submitEnabled : false, xhrStatus : 'submitting', errorString : null }, function () {
			xhr.post ('/vc-admin/roles/add', this.state.role)
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
					.col-md-8.col-sm-12.col-xs-12
						.x_panel
							.x_content
								h4 Add a new Role
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
										span &nbsp created ok.

								if ${this.state.errorString}
									.text-danger
										span ${this.state.errorString}
			`
		);
	}
}

export default RolesAddForm;
