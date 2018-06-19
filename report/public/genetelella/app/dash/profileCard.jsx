import React       from 'react';

class ProfileCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount () {
		console.log({props:this.props}, 'Props')
		if (!this.props.name)
			throw 'name is missing';
	}

	render () {
		var props = {
			imgSrc        : this.props.imgSrc || '/vc-admin/gene/production/images/user.png',
			imgAlt        : this.props.imgAlt || '...',
			mailTo        : this.props.mailTo || '',
			name          : this.props.name,
			subname       : this.props.subname,
			list          : this.props.list || '',
		};


		return (
			pug`
				.widget.widget_tally_box
					.x_panel.fixed_height_390
						.x_content
							.flex
								ul.list-inline.widget_profile_box.center
									li
										img.img-circle.profile_img(src=props.imgSrc, alt=props.imgAlt)
							h3.name #{props.name}
							.flex
								ul.list-inline.count2.center
									li
										span #{props.subname}
							div
								ul.list-inline.widget_tally.profile_card
									each item, index in props.list
										li(key=index)
											p
												span.month #{item.label} 
												span #{item.value}

			`
		);
	}
}

export default ProfileCard;
