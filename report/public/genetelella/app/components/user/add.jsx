import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import xhr         from '../../common/xhr';
import Password    from './password.jsx';
import Input       from '../misc/input-form-group.jsx';
import Select      from '../misc/select.jsx';
import identity    from '../../common/identity';
import '../../less/table.less';

class UserAddForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			xhrStatus     : 'init',
			errString     : null,
			id            : null,
			firstName     : null,
			lastName      : null,
			password      : null,
			email         : null,
			orgId         : null,
			roleId        : null,
			submitEnabled : false,
		};

		this.errXHR        = React.createRef();
		this.okXHR         = React.createRef();
		this.submitBtn     = React.createRef();

		this.check       = this.check.bind(this);
		this.submit      = this.submit.bind(this);
		this.getPassword = this.getPassword.bind(this);
	}

	hasValue (item) {
		return item && item.length;
	}

	toggleSubmit () {
		var state = this.state;

		if (this.hasValue (state.id) &&
			this.hasValue (state.firstName) && 
			this.hasValue (state.lastName) && 
			this.hasValue (state.password) && 
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

	getPassword (password) {
		this.setState ({ password : password }, () => this.toggleSubmit ());
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

			xhr.post ('/vc-admin/user/add', data)
				.then (() => { 
					return xhr.post ('/vc-admin/user/passwd/', { id : this.state.id, password : this.state.password }) 
				})
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

	render() {
		var user     = identity.cached ();
		var addScope = user.scopeAdd ('users');

		if (!addScope)
			return (
				<span> No scope for add operation </span>
			);

		return (
			<div className="row">
				<div className="col-md-12 col-sm-12 col-xs-12">
					<div className="x_panel">
						<div className="x_content">
							<h4>Add a new User</h4>
							<br />
						</div>
						<div className="x_content">
							<form>
								<div className="row">
									<div className="col-md-4 col-sm-4">
										<Input _key='id' type="text" placeholder="Preferred user id" onChange={this.check} validate={ new RegExp(/^[a-zA-Z_0-9]+$/g) } errorMessage="only alphanumeric characters allowed"/> 
									</div>
									<div className="col-md-4 col-sm-4">
										<Input _key='firstName' type="text" placeholder="First name" onChange={this.check} validate={ new RegExp(/^[a-zA-Z]+$/g) } errorMessage="only alphabets allowed"/>
									</div>
									<div className="col-md-4 col-sm-4">
										<Input _key='lastName' type="text" placeholder="Last name" onChange={this.check} validate={ new RegExp(/^[a-zA-Z]+$/g) } errorMessage="only alphabets allowed"/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-sm-4">
										<Input _key='email' type="text" placeholder="Email" onChange={this.check}
										validate={ new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) }
										errorMessage="invalid email"/>
									</div>
									<div className="col-md-4 col-sm-4">
										<Select value={this.state.orgId} _key="orgId" placeholder="Organization" onChange={this.check}
										 url='/vc-admin/org/list'
										 mapper={(curr) => { return { label : curr.name, value : curr._id }}}
										/>
									</div>
									<div className="col-md-4 col-sm-4">
										<Select value={this.state.roleId} _key="roleId" placeholder="Role" onChange={this.check}
										 url='/vc-admin/roles/list'
										 mapper={(curr) => { return { label : curr.name, value : curr._id }}}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-8 col-sm-8">
										<Password onChange={this.getPassword}/>
									</div>
									<div className="col-md-4 col-sm-4 form-group">
										<div >
											<button type="button" className={ "btn btn-primary " + (this.state.submitEnabled ? '' : 'disabled')} onClick={this.submit}>
												Add !
											</button>
										</div>
									</div>
								</div>
							</form>
							<div className="row">
								{ this.state.xhrStatus == 'submitting' && 
									<div>
										<span className="fa fa-spinner fa-spin"> </span> 
										<span> Connecting to server ...  </span> 
									</div>
								}
								{ this.state.errString && <span className="text-danger col-md-12"> {this.state.errString} </span>}
								{ this.state.xhrStatus == 'success' && <span className="text-success col-md-12"> User "{this.state.firstName + ' ' + this.state.lastName}" added ok </span>}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default UserAddForm;
