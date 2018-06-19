import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import xhr         from '../../common/xhr';
import Password    from './password.jsx';
import Input       from '../misc/input-form-group.jsx';
import Select      from '../misc/select.jsx';
import Checkboxes  from '../misc/checkbox.jsx';
import '../../less/table.less';

class UserEditForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			xhrStatus         : 'init',
			errString         : null,
			id                : '',
			firstName         : '',
			lastName          : '',
			email             : '',
			orgId             : '',
			roleId            : '',
			submitEnabled     : false,

			/* Password related states */
			password          : '',
			passEditEnabled   : false,
			submitPassEnabled : false,
			passXHRStatus     : 'init',
			passErrString     : null,
		};

		this.check          = this.check.bind(this);
		this.submit         = this.submit.bind(this);
		this.getPassword    = this.getPassword.bind(this);
		this.checkBoxChange = this.checkBoxChange.bind(this);
		this.submitPassword = this.submitPassword.bind(this);
	}

	componentDidMount () {
		var _this = this;

		if (!this.props.match.params.user_id)
			return;

		this.setState ({ xhrStatus : 'fetching', errString : null, submitEnabled : false }, () => {
			xhr.get ('/vc-admin/user/detail/' + this.props.match.params.user_id)
				.then ((info) => {
					_this.setState({ 
						xhrStatus     : 'init', 
						id            : info.id,
						firstName     : info.firstName,
						lastName      : info.lastName,
						email         : info.email,
						orgId         : { value : info.orgId },
						roleId        : { value : info.roleId },
					}, this.toggleSubmit);
				})
				.fail ((err) => {
					_this.setState({ submitEnabled : false, xhrStatus : 'error', errString : err });
				});
		});
	}

	hasValue (item) {
		return item && (item.trim().length > 0);
	}

	toggleSubmit () {
		var state = this.state;

		if (this.hasValue (state.id) &&
			this.hasValue (state.firstName) && 
			this.hasValue (state.lastName) && 
			this.hasValue (state.email) && 
			this.hasValue (state.orgId && state.orgId.value) &&
			this.hasValue (state.roleId && state.roleId.value)
		) {
			this.setState ({ submitEnabled : true });
			return;
		}

		this.setState ({ submitEnabled : false });
	}

	check (event) {
		var key   = event.key;
		var value = event.value;
		var _set  = {};
		var state;

		_set[key] = value;
		this.setState (_set, () => this.toggleSubmit ());
	}

	checkBoxChange (event) {
		var value = event.value.reset || false;

		this.setState ({ passEditEnabled : value });
	}

	getPassword (password) {
		if (!password)
			return;

		this.setState ({ password : password, submitPassEnabled : true });
	}

	submit (event) {
		event.preventDefault();
		var _this = this;

		if (!this.state.submitEnabled)
			return;

		this.setState({ submitEnabled : false, xhrStatus : 'submitting', errString : null }, function () {

			var data = {
				id            : this.state.id,
				firstName     : this.state.firstName,
				lastName      : this.state.lastName,
				email         : this.state.email,
				orgId         : this.state.orgId.value,
				roleId        : this.state.roleId.value,
			};

			xhr.post ('/vc-admin/user/edit/' + this.state.id, data)
				.then (() => {
					_this.setState({ submitEnabled : true, xhrStatus : 'success', errString : null });

					if (this.props.callback)
						return this.props.callback (null, this.state);
				})
				.fail ((err) => {
					_this.setState({ submitEnabled : true, xhrStatus : 'error', errString : err });
				});
		});
	}

	submitPassword (event) {
		var _this = this;

		this.setState ({ submitPassEnabled : false, passXHRStatus : 'submitting' }, () => {
			xhr.post ('/vc-admin/user/passwd/reset/', {
				id       : this.props.match.params.user_id.replace (/:.*$/g, ''),
				password : this.state.password
			}) 
			.then (() => {
				_this.setState({ submitPassEnabled : true, passXHRStatus : 'success', passErrString : null });

				if (this.props.callback)
					return this.props.callback (null, this.state);
			})
			.fail ((err) => {
				_this.setState({ submitPassEnabled : true, passXHRStatus : 'error', passErrString : err });
			});
		});
	}

	render() {
		if (!this.props.match.params.user_id)
			return 'No user specified';

		return (
		<div>
			<div className="row">
				<div className="col-md-12 col-sm-12 col-xs-12">
					<div className="x_panel">
						<div className="x_content">
							<h4>Edit User</h4>
						</div>
						<div className="x_content">
							<form>
								{ this.state.xhrStatus === 'fetching' && 
									<div className="row">
										<div className="col-md-12 col-sm-12">
											<span className="fa fa-spinner fa-spin"> </span>
											<span> Fetching info ...</span>
										</div>
									</div>
								}
								<div className="row">
									<div className="col-md-4 col-sm-4">
										<Input value={this.state.id} disabled={true} type="text" placeholder="User id" /> 
									</div>
									<div className="col-md-4 col-sm-4">
										<Input value={this.state.firstName} _key='firstName' type="text" placeholder="First name" onChange={this.check} validate={ new RegExp(/^[a-zA-Z]+$/g) } errorMessage="only alphabets allowed"/>
									</div>
									<div className="col-md-4 col-sm-4">
										<Input value={this.state.lastName} _key='lastName' type="text" placeholder="Last name" onChange={this.check} validate={ new RegExp(/^[a-zA-Z]+$/g) } errorMessage="only alphabets allowed"/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-sm-4">
										<Input value={this.state.email} _key='email' type="text" placeholder="Email" onChange={this.check}
										validate={ new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) }
										errorMessage="invalid email"/>
									</div>
									<div className="col-md-4 col-sm-4">
										<Select
										value={this.state.orgId && this.state.orgId.value || ''}
										_key="orgId" 
										placeholder="Organization"
										onChange={this.check}
										url='/vc-admin/org/list'
										mapper={(curr) => { return { label : curr.name, value : curr._id }}}
										/>
									</div>
									<div className="col-md-4 col-sm-4">
										<Select
										value={this.state.roleId && this.state.roleId.value || ''}
										_key="roleId"
										placeholder="Role"
										onChange={this.check}
										url='/vc-admin/roles/list'
										mapper={(curr) => { return { label : curr.name, value : curr._id }}}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-sm-4 form-group">
										<div >
											<button type="button" className={ "btn btn-primary " + (this.state.submitEnabled ? '' : 'disabled')} onClick={this.submit}>
												Submit
											</button>
										</div>
									</div>
								</div>
							</form>
							<div className="row">
								<div className="col-md-12 col-sm-12">
									{ this.state.xhrStatus == 'submitting' && 
										<div>
											<span className="fa fa-spinner fa-spin"> </span> 
											<span> Connecting to server ...  </span> 
										</div>
									}
									{ this.state.errString && <span className="text-danger"> {this.state.errString} </span>}
									{ this.state.xhrStatus == 'success' && <span className="text-success"> User "{this.state.firstName + ' ' + this.state.lastName}" edited ok </span>}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-md-12 col-sm-12 col-xs-12">
					<div className="x_panel">
						<div className="x_content">
							<h4>Reset Password</h4>
							<Checkboxes
								onChange={this.checkBoxChange}
								_key='reset'
								values={[ { value : 'reset', label : 'Enable Reset', checked : this.passEditEnabled } ]}
							/>
							<br />
							<br />
							<div className="row">
								<div className="col-md-8 col-sm-8">
									<Password onChange={this.getPassword} readOnly={!this.state.passEditEnabled}/>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4 col-sm-4 form-group">
									<div >
										<button type="button" className={ "btn btn-primary " + (this.state.submitPassEnabled ? '' : 'disabled')} onClick={this.submitPassword}>
											Reset
										</button>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12 col-sm-12">
									{ this.state.passXHRStatus == 'submitting' && 
										<div>
											<span className="fa fa-spinner fa-spin"> </span> 
											<span> Connecting to server ...  </span> 
										</div>
									}
									{ this.state.passErrString && <span className="text-danger"> {this.state.passErrString} </span>}
									{ this.state.passXHRStatus == 'success' && <span className="text-success"> Password for "{this.state.firstName + ' ' + this.state.lastName}" reset ok </span>}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		);
	}
}

export default UserEditForm;
