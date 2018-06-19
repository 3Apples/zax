import React            from 'react';
import Resolve          from '../components/misc/resolve.jsx';

class UserListWidget extends React.Component {

	constructor (props) {
		super (props);
		this.state = {};
	}

	componentWillMount () {
		let options = this.props.options;
		if (!options.heading)
			throw 'heading required';
		if (!options.userList)
			throw 'userList required';
	}

	render () {
		const options = this.props.options;	
		const props   = {
			heading     : options.heading,
			userList    : options.userList,
		};

		return (
			pug`
				.x_panel
					.x_title
						h2 #{props.heading}
						.clearfix
					ul.list-unstyled.top_profiles.scroll-view
						each user, index in props.userList
							li.media.event(key=index)
								a.pull-left.border-aero.profile_thumb
									i.fa.fa-user.aero
								.media-body
									a.title(href='#') #{user.firstName + ' ' + user.lastName}
									p
										Resolve(Id=user.roleId profile='Role')
									p
										strong E-mail: 
										| #{user.email} 
			`
		);
	}
}

export default UserListWidget;
