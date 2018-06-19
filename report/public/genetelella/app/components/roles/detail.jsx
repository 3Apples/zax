import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import {Link}      from 'react-router-dom';
import xhr         from '../../common/xhr';
import Resolve     from '../misc/resolve.jsx';
import JSONView    from '../misc/jsonview.jsx'
import PermsWidget from './perms-widget.jsx';

class OrgDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error : null,
			role  : null
		};
	}

	componentDidMount () {
		this.getDetails ();
	}

	getDetails () {
		xhr.get ("/vc-admin/roles/detail/" + this.props.match.params.role_id)
		.then(
			(result) => {
				this.setState({
					role : result
				});
			},
			(error) => {
				this.setState({
					error:    error,
				});
			}
		);
	}

	dummyCallback () {}

	render() {

		if (!this.state.role)
			return pug`span No data yet`;

		return pug`
				.row
					.col-md-6.col-sm-6.col-xs-12
						.x_panel
							.x_title
								h2.text-center ${this.state.role.name}
								ul.nav.navbar-right.panel_toolbox
									li
										Link(to=${'/vc-admin/roles/edit/page/' + this.state.role._id})
											span.fa.fa-pencil
								.clearfix
							.x_content
								.row
									.col-md-12.col-sm-12.col-xs-12
										table.table.table-condensed.table-striped.table-bordered
											tbody
												tr
													td Id
													td ${this.state.role._id} 
												tr
													td Name
													td ${this.state.role.name} 
												tr
													td Created By
													td
														Resolve(Id=${this.state.role.createdBy}, profile='User', noHyperLink=${true})
												tr
													td Created On
													td ${moment (this.state.role.createdTs).format ('YYYY MM DD hh:mm a')} 

								.row
									.col-md-12.col-sm-12.col-xs-12
										h4 Details
								PermsWidget(
									role=${this.state.role},
									callback=${this.state.dummyCallback},
									readOnly=${true}
								)
					.col-md-6.col-sm-6.col-xs-12
						.x_panel
							JSONView(obj=${this.state.role}, title='Structure')
						.clearfix
		`;
	}
}

export default OrgDetail;
