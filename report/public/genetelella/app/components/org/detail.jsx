import {$,jQuery}  from 'jquery';
window.$ = $;
window.jQuery = jQuery;

import moment      from 'moment';
import React       from 'react';
import xhr         from '../../common/xhr';
import Resolve     from '../misc/resolve.jsx';
import { Breadcrumb } from 'react-breadcrumbs';

class OrgDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: 'init',
			data   : null,
			error  : null,
		};
	}

	componentDidMount () {
		this.setState ({ loading: 'loading' }, () => {
			this.getDetails ();
		});
	}

	getDetails () {
		xhr.get ("/vc-admin/org/detail/" + (this.props.match.params.orgId || ''))
		.then(
			(result) => {
				this.setState({
					loading: 'done',
					data : result
				});
			},
			(error) => {
				this.setState({
					loading: 'error',
					error:    error,
				});
			}
		);
	}

	render() {

		if (this.state.loading === 'init')
			return pug`span Initializing ...`;

		if (this.state.loading === 'loading')
			return (pug`
					div
						span.fa.fa-spinner.fa-spin
						span &nbsp Loading ...`
				   );

		if (this.state.loading === 'error')
			return (pug`
					span.text-danger ${this.state.error}
					`);

		var name   = this.state.data.name || 'loading ...';
		var abbrev = `(${this.state.data.abbrev})` || '';
		var email  = this.state.data.email || '';
		var fullName = `${name} ${abbrev}`;
		var description = this.state.data.description || '';
		var address_1, address_2;

		if (this.state.data.addresses.length > 0)
			address_1 = this.state.data.addresses[0];
		if (this.state.data.addresses.length > 1)
			address_2 = this.state.data.addresses[1];

		return pug`
				style(type='text/css').
					table.addr td:nth-child(1) {
						width : 75px;
					}

				.row
					.col-md-6.col-sm-6.col-xs-12
						.x_panel
							.x_title
								h2.text-center(style=${{ 'float' : 'initial' }}) ${fullName}
								.clearfix
								h5.text-center(style=${{ 'fontStyle':'italic' }}) ${email}
							.x_content
								.row
									.col-md-12.col-sm-12.col-xs-12
										h4 Description
										span ${description};
					.col-md-6.col-sm-6.col-xs-12
						.x_panel
							.row
								.col-md-6.col-sm-6.col-xs-6
									h4 Address 1
									if !address_1
										p No address
									else
										table.addr.table.table-condensed.table-striped.table-bordered
											tbody
												tr
													td Address
													td 
														p ${address_1.line1} 
														p ${address_1.line2} 
												tr
													td District
													td ${address_1.district} 
												tr
													td State
													td ${address_1.state} 
												tr
													td Pin
													td ${address_1.pincode} 
												tr
													td Country
													td ${address_1.country} 
												tr
													td Contact
													td ${address_1.contact} 

								.col-md-6.col-sm-6.col-xs-6
									h4 Address 2
									if !address_2
										p No address
									else
										table.addr.table.table-condensed.table-striped.table-bordered
											tbody
												tr
													td Address
													td 
														p ${address_2.line1} 
														p ${address_2.line2} 
												tr
													td District
													td ${address_2.district} 
												tr
													td State
													td ${address_2.state} 
												tr
													td Pin
													td ${address_2.pincode} 
												tr
													td Country
													td ${address_2.country} 
												tr
													td Contact
													td ${address_2.contact} 
				.row
					.col-md-12.col-sm-12.col-xs-12
						.x_panel
							.x_content
								span 
									i Entry created by 
									b 
										Resolve(Id=${this.state.data.createdBy}, profile='User')
									i on 
									b ${moment (this.state.data.createdTs).format('YYYY MMM DD hh:mm a')}
		`;
	}
}

export default OrgDetail;
