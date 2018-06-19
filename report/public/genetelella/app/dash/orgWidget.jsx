import $           from 'jquery';
import React       from 'react';
import xhr         from '../common/xhr';
import moment      from 'moment';
import ProfileCard from './profileCard.jsx';
import identity    from '../common/identity';

class statWidget extends React.Component {

	constructor (props) {
		super (props);
		this.state = {
			userData     : null,
			orgData      : null,
			heading      : 'License',
			percentage   : 0,
			licenseState : '-',
			licenseName  : 'No Active License',
			licenseDesc  : 'Your organisation does not have an active license'
		};
	}

	componentDidMount () {
		this.getUserData ()
			.then(
				(result) => {
					this.getOrgData ();
				},
				(error) => {
					this.setState ({
						error      : error,
					});
				}
			);
	}
	
	getUserData () {
		var p = $.Deferred ();
		xhr.get ('/vc-admin/user/detail')
			.then (
				(result) => { 
					console.log ({ userData : result }, 'User Data');
					this.setState ({
						userData       : result,
					});
					p.resolve (result);
				},
				(error) => {
					this.setState ({
						error      : error,
					});
					p.reject ();
				}
			);
		return p.promise ();
	}
	
	getOrgData () {
		let orgId = (this.userData) ? this.userData.detail.orgId : '';
		xhr.get ("/vc-admin/org/detail/" + (orgId || ''))
		.then(
			(result) => {
				console.log ({ orgData : result }, 'Org Data');
				this.setState({
					orgData : result
				});
			},
			(error) => {
				this.setState({
					error:    error,
				});
			}
		);
	}

	render () {
		let data = this.state.orgData;
		const props = {
			imgAlt        : '...',
			name          : (data) ? data.name : '-',
			subname       : (data) ? data.abbrev : '-',
			list          : [
				{ label : 'E-mail', value : ((data) ? data.email : '') },
				{ label : 'Active since', value : ((data) ? moment(data.createdTs).format('Do MMMM YYYY') : '') },
			],
		};

		return (
			pug`
				ProfileCard(...props)
				`
		);
	}
}

export default statWidget;
