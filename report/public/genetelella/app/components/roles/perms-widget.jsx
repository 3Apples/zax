import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import xhr         from '../../common/xhr';
import Input       from '../misc/input-form-group.jsx';
import Checkboxes  from '../misc/checkbox.jsx';
import Radios      from '../misc/radio.jsx';
import Select  from '../misc/select.jsx';
import '../../less/misc.less';
import './roles.less';

var defaultPerms = {
	org  : {
		scope : null,
		add   : { allowed : false },
		edit  : { allowed : false },
		remove: { allowed : false },
		view  : { allowed : false }
	},
	presentations : {
		scope : null,
		add   : { allowed : false },
		edit  : { allowed : false },
		remove: { allowed : false },
		view  : { allowed : false }
	},
	users  : {
		scope : null,
		add   : { allowed : false },
		edit  : { allowed : false },
		remove: { allowed : false },
		view  : { allowed : false }
	},
	roles  : {
		scope : null,
		add   : { allowed : false },
		edit  : { allowed : false },
		remove: { allowed : false },
		view  : { allowed : false }
	},
};

class PermsWidget extends React.Component {

	constructor(props) {
		super(props);

		if (props.role) {
			this.state = {
				role            : this.checkRole(props.role),
				allRolesChecked : false,
			};
		}
		else {
			this.state = {
				role         : {
					name     : '',
					perms    : defaultPerms,
				},
			};
		}

		this.check       = this.check.bind(this);
	}

	checkRole (role) {
		if (!role.perms)
			role.perms = defaultPerms;

		if (!role.perms.org)
			role.perms.org = defaultPerms.org;

		if (!role.perms.presentations)
			role.perms.presentations = defaultPerms.presentations;

		if (!role.perms.users)
			role.perms.users = defaultPerms.users;

		if (!role.perms.flags) {
			role.perms.flags = {
				admin3a : false,
			};
		}

		if (!role.perms.roles)
			role.perms.roles = defaultPerms.roles;

		return role;
	}

	check (event) {
		var key   = event.key;
		var value = event.value;
		var values = event.values;

		this.setPermsState (key, value, values);
	}

	setPermsState (key, value, values) {
		var role  = this.state.role;
		var perms = role.perms;
		var tag;

		switch (key) {
			case 'name':
				role.name = value;
				break;

			case 'scope/org':

				if (!perms.org.scope)
					perms.org.scope = {};

				if (value === 'self')
					perms.org.scope._id = ':self={orgId}';
				else if (value === 'all')
					perms.org.scope._id = '*';
				else /* if 'none' */
					perms.org.scope = null;
				break;

			case 'scope/presentations':

				if (!perms.presentations.scope)
					perms.presentations.scope = {};

				if (value === 'self') {
					perms.presentations.scope.createdBy = ':self={id}';
					perms.presentations.scope.org       = '*';
				}
				else if (value === 'org-ref') {
					perms.presentations.scope.createdBy = '*';
					perms.presentations.scope.org       = ':ref={org._id}';
				}
				else {
					perms.presentations.scope = null;
				}
				break;

			case 'scope/users':

				if (!perms.users.scope)
					perms.users.scope = {};

				if (value === 'self') {
					perms.users.scope.id    = ':self={id}';
					perms.users.scope.orgId = '*';
				}
				else if (value === 'org-ref') {
					perms.users.scope.id    = '*';
					perms.users.scope.orgId = ':ref={org._id}';
				}
				else {
					perms.users.scope = null;
				}
				break;

			case 'scope/roles':
				
				if (!perms.roles.scope)
					perms.roles.scope = {};

				if (value && value.allRoles && value.allRoles.checked) {
					perms.roles.scope._id = '*';
				} else if ( values && Array.isArray (values) && values.length > 0) {
					perms.roles.scope._id = values.map ( obj => obj.value);
				} else {
					perms.roles.scope = null;
				}
				break;

			case 'verb/org':
			case 'verb/presentations':
			case 'verb/users':
				tag = key.replace(/verb\//g, '');
				perms[tag].add    = { allowed : value.add.checked };
				perms[tag].edit   = { allowed : value.edit.checked };
				perms[tag].remove = { allowed : value.remove.checked };
				perms[tag].view   = { allowed : value.view.checked };
				break;
			case 'verb/roles':
				tag = key.replace(/verb\//g, '');
				perms[tag].view   = { allowed : value.view.checked };
				break;

			case 'flags/admin3a':
				perms.flags.admin3a = value.admin3a.checked;
				break;
		}

		this.setState ({ role : role }, () => { this.props.callback (this.state.role);});
	}

	render() {
		var state = this.state;
		var org, presentations, users, roles;

		var _org = this.state.role && this.state.role.perms && this.state.role.perms.org || {};
		org = {
			none   : _org.scope && _org.scope._id ? false : true,
			all    : _org.scope && _org.scope._id == '*' ? true : false,
			self   : _org.scope && _org.scope._id == ':self={orgId}' ? true : false,
			add    : _org.add && _org.add.allowed ? true : false,
			edit   : _org.edit && _org.edit.allowed ? true : false,
			remove : _org.remove && _org.remove.allowed ? true : false,
			view   : _org.view && _org.view.allowed ? true : false,
		};
		var _pres = this.state.role && this.state.role.perms && this.state.role.perms.presentations || {};
		presentations = {
			none   : !_pres.scope || !(_pres.scope.org || _pres.scope.createdBy),
			orgRef : _pres.scope && _pres.scope.org == ':ref={org._id}' ? true : false,
			self   : _pres.scope && _pres.scope.createdBy == ':self={id}' ? true : false,
			add    : _pres.add && _pres.add.allowed ? true : false,
			edit   : _pres.edit && _pres.edit.allowed ? true : false,
			remove : _pres.remove && _pres.remove.allowed ? true : false,
			view   : _pres.view && _pres.view.allowed ? true : false,
		};
		var _users = this.state.role && this.state.role.perms && this.state.role.perms.users;
		users = {
			none   : !_users.scope || !(_users.scope.orgId || _users.scope.id),
			orgRef : _users.scope && _users.scope.orgId == ':ref={org._id}' ? true : false,
			self   : _users.scope && _users.scope.id == ':self={id}' ? true : false,
			add    : _users.add && _users.add.allowed ? true : false,
			edit   : _users.edit && _users.edit.allowed ? true : false,
			remove : _users.remove && _users.remove.allowed ? true : false,
			view   : _users.view && _users.view.allowed ? true : false,
		};
		
		var _flags = this.state.role && this.state.role.perms && this.state.role.perms.flags;
		var flags = {
			admin3a   : _flags && _flags.admin3a || false,
		};

		var _roles = this.state.role && this.state.role.perms && this.state.role.perms.roles;
		roles = {
			view     : _roles.view && _roles.view.allowed ? true : false,
			allRoles : _roles.scope && _roles.scope._id == '*' ? true : false,
		};

		var isRolesSelectEnabled = setRolesSelect (this);

		function setRolesSelect (self) {
			if (self.props.readOnly)
				return false;
			if (roles.allRoles)
				return false;
			return true;
		}

		return (
			pug`
				.row
					.col-md-12.col-sm-12.col-xs-12
						Input(
							_key='name',
							type="text",
							disabled=${this.props.readOnly ? true : false},
							placeholder="Role Name",
							onChange=${ this.check },
							validate=${ new RegExp(/^[a-zA-Z0-9-_ ]+$/g) },
							value=${this.state.role.name},
							errorMessage="only alphanumeric characters allowed"
						)

				//
				// Flags
				//

				.row
					.col-md-12.col-sm-12.col-xs-12
						.perm-group
							.row
								.col-md-12.col-sm-12.col-xs-12
									h4 Flags
							.row.perm-line
								.col-md-12.col-sm-12.col-xs-12
									Checkboxes(
										onChange=${this.check},
										_key="flags/admin3a",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'admin3a', label : 'Admin 3Apples', checked : flags.admin3a },
											]}
									)

				//
				// Organization Perms
				//

				.row
					.col-md-12.col-sm-12.col-xs-12
						.perm-group
							.row
								.col-md-12.col-sm-12.col-xs-12
									h4 Organizations
							.row.perm-line
								.col-md-1.col-sm-1.col-xs-1
									label Scope
								.col-md-11.col-sm-11.col-xs-11
									Radios(
										onChange=${this.check},
										_key="scope/org",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'none', label : 'None', checked : org.none },
												{ value : 'self', label : 'Self', checked : org.self },
												{ value : 'all', label : 'All', checked : org.all },
											]}
									)
							.row.perm-line
								.col-md-1.col-sm-1.col-xs-1
									label Verb
								.col-md-11.col-sm-11.col-xs-11
									Checkboxes(
										onChange=${this.check},
										_key="verb/org",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'add', label : 'Add', checked:org.add },
												{ value : 'edit', label : 'Edit', checked:org.edit },
												{ value : 'remove', label : 'Remove', checked:org.remove },
												{ value : 'view', label : 'View', checked:org.view },
											]}
									)

				//
				// Presentation Perms
				//

				.row
					.col-md-12.col-sm-12.col-xs-12
						.perm-group
							.row
								.col-md-12.col-sm-12.col-xs-12
									h4 Presentations
							.row.perm-line
								.col-md-1.col-sm-1.col-xs-1
									label Scope
								.col-md-11.col-sm-11.col-xs-11
									Radios(
										onChange=${this.check},
										_key="scope/presentations",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'none', label : 'None', checked : presentations.none },
												{ value : 'self', label : 'Created by self', checked : presentations.self },
												{ value : 'org-ref', label : 'Organization Scope', checked : presentations.orgRef },
											]}
									)
							.row.perm-line
								.col-md-1.col-sm-1.col-xs-1
									label Verb
								.col-md-11.col-sm-11.col-xs-11
									Checkboxes(
										onChange=${this.check},
										_key="verb/presentations",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'add', label : 'Add', checked : presentations.add },
												{ value : 'edit', label : 'Edit', checked : presentations.edit },
												{ value : 'remove', label : 'Remove', checked : presentations.remove },
												{ value : 'view', label : 'View', checked : presentations.view },
											]}
									)

				//
				// Users Perms
				//

				.row
					.col-md-12.col-sm-12.col-xs-12
						.perm-group
							.row
								.col-md-12.col-sm-12.col-xs-12
									h4 Users
							.row.perm-line
								.col-md-1.col-sm-1.col-xs-1
									label Scope
								.col-md-9.col-sm-9.col-xs-9
									Radios(
										onChange=${this.check},
										_key="scope/users",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'none', label : 'None', checked : users.none },
												{ value : 'self', label : 'Self', checked : users.self },
												{ value : 'org-ref', label : 'Organization Scope', checked : users.orgRef },
											]}
									)
							.row.perm-line
								.col-md-1.col-sm-1.col-xs-1
									label Verb
								.col-md-11.col-sm-11.col-xs-11
									Checkboxes(
										onChange=${this.check},
										_key="verb/users",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'add', label : 'Add', checked : users.add },
												{ value : 'edit', label : 'Edit', checked : users.edit },
												{ value : 'remove', label : 'Remove', checked : users.remove },
												{ value : 'view', label : 'View', checked : users.view },
											]}
									)

				//
				// Roles Perms
				//

				.row
					.col-md-12.col-sm-12.col-xs-12
						.perm-group
							.row
								.col-md-12.col-sm-12.col-xs-12
									h4 Roles
							.row.perm-line
								.col-md-1.col-sm-1.col-xs-1
									label Scope
								.col-md-2.col-sm-2.col-xs-2
									Checkboxes(
										onChange=${this.check},
										_key="scope/roles",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'allRoles', label : 'All Roles', checked : roles.allRoles },
											]}
									)
								.col-md-8.col-sm-8.col-xs-8
									Select(
									value=${(this.state.role.perms.roles.scope ) ? this.state.role.perms.roles.scope._id : null}
									isMulti,
									disabled=${!isRolesSelectEnabled},
									_key="scope/roles"
									placeholder="Role(s)"
									onChange=${this.check}
									url='/vc-admin/roles/list'
									mapper=${(curr) => { return { label : curr.name, value : curr._id }}}
									)
							.row.perm-line
								.col-md-1.col-sm-1.col-xs-1
									label Verb
								.col-md-11.col-sm-11.col-xs-11
									Checkboxes(
										onChange=${this.check},
										_key="verb/roles",
										readOnly=${this.props.readOnly},
										values=${[ 
												{ value : 'view', label : 'View', checked : roles.view },
											]}
									)
				.clearfix
			`
		);
	}
}

export default PermsWidget;
