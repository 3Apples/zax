import $           from 'jquery';
import React       from 'react';
import xhr         from '../common/xhr';
import moment      from 'moment';
import LicenseCard from './licenseCard.jsx';
import identity    from '../common/identity';
class statWidget extends React.Component {

	constructor (props) {
		super (props);
		this.state = {
			userData     : null,
			licData  : null,
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
					this.getActiveLicense ();
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
	
	getActiveLicense () {
		let orgId = this.state.userData.detail.orgId;
		xhr.get ('/vc-admin/lic/instance/active/' + orgId)
			.then (
				(result) => { 
					console.log ({ licData : result }, 'lic Data');
					this.setState ({
						licData       : result,
						serverTs     : result.server_ts,
					});

					this.calculatePercentage ();
				},
				(error) => {
					this.setState ({
						error      : error,
					});
				}
			);
	}


	calculatePercentage (time) {
		let nowTs, licTs, duration, diff, percent, desc, leftDays;

		nowTs    = (this.state.serverTs) ? this.state.serverTs : moment().toISOString();
		licTs    = this.state.licData.activatedTs;
		duration = this.state.licData.archetype.licenseDuration;
		diff = moment(nowTs).diff(moment(licTs), 'minutes');
		leftDays = duration - moment(nowTs).diff(moment(licTs), 'days');
		percent = ((1-(diff/(duration*1440))) * 100).toFixed(3);
		desc = 'License active since ' + moment(licTs).format('Do MMMM YYYY') + '. Active for ' + leftDays +' more days.';

		this.setState({
			percentage : percent,
			licDesc    : desc,
		});
	}

	render () {
		let data = this.state.licData;
		const props = {
			heading       : 'License',
			percentage    : this.state.percentage,
			state         : (data) ? 'Active' : '-',
			name          : (data) ? data.archetype.name : 'No Active License',
			body          : (data) ? this.state.licDesc : 'Your organisation does not have an active license',
		};

		return (
			pug`
				LicenseCard(...props)
				`
		);
	}
}

export default statWidget;
