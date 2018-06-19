import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import {Link}      from 'react-router-dom';
import xhr         from '../../common/xhr';
import Resolve     from '../misc/resolve.jsx';
import identity    from '../../common/identity';

class UserDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error : null,
			data  : null
		};
	}

	componentDidMount () {
		this.getDetails ();
	}

	getDetails () {
		var user_id = this.props.match.params.user_id || identity.id ();

		xhr.get ("/vc-admin/user/detail/" + user_id)
		.then(
			(result) => {
				this.setState({
					data : result
				});
			},
			(error) => {
				this.setState({
					error:    error,
				});
			}
		);
	}

	render() {

		if (!this.state.data)
			return pug`span No data yet`;

		var id      = this.state.data.id;
		var fName   = this.state.data.firstName || '';
		var lName   = this.state.data.lastName || '';
		var name    = fName + ' ' + lName;
		var mapper  = (detail) => { return detail.name; }
		var user    = identity.cached ();
		var viewScope = user.isInViewScope ('users', this.state.data);
		var editScope = user.isInEditScope ('users', this.state.data);
		var admin3a   = user.permFlags && user.permFlags.admin3a || false;
		var orgScope  = user.isInViewScope('org', { orgId : user.user.orgId })

		return pug`
			if ${viewScope}
				.row
					.col-md-6.col-sm-6.col-xs-12
						.x_panel
							.x_title
								h2.text-center ${name}

								if ${editScope}
									ul.nav.navbar-right.panel_toolbox
										li
											Link(to=${'/vc-admin/user/edit/page/' + id})
												span.fa.fa-pencil
								.clearfix
							.x_content
								.row
									.col-md-12.col-sm-12.col-xs-12
										table.table.table-condensed.table-striped.table-bordered
											tbody
												tr
													td Id
													td ${this.state.data.id.replace(/:/g, '/')} 
												tr
													td Name
													td ${name} 
												tr
													td Email
													td ${this.state.data.email} 
												tr
													td Role
													td
														Resolve(Id=${this.state.data.roleId}, profile='Role', noHyperLink=${!admin3a})
												tr
													td Status
													td ${this.state.data.status} 
												tr
													td Created By
													td
														Resolve(Id=${this.state.data.createdBy}, profile='User', noHyperLink=${true})
												tr
													td Created On
													td ${moment (this.state.data.createdTs).format ('YYYY MM DD hh:mm a')} 
												tr
													td Organization Id
													td 
														Resolve(Id=${this.state.data.orgId}, profile='Org', noHyperLink=${!orgScope})
			else
				span No scope for viewing this information
						.clearfix
		`;
	}
}

export default UserDetail;
