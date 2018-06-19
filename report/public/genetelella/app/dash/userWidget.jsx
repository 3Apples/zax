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
		this.getUserData ();
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
	
	render () {
		let data = (this.state.userData) ? this.state.userData.detail : null;
		const props = {
			imgSrc        : '/vc-admin/gene/production/images/donkey.jpg',
			imgAlt        : '...',
			name          : (data) ? data.firstName + ' ' + data.lastName : '-',
			subname       : (data) ? data.role.name : '-',
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
