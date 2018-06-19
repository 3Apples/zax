import React  from 'react';

class statWidget extends React.Component {

	constructor (props) {
		super (props);
		this.state = {};
	}

	componentWillMount () {
		let options = this.props.options;
		if (!options.title)
			throw 'title required';
		if (options.count <= 0 && !options.count)
			throw 'count required';
		if (!options.iconClass)
			throw 'iconClass required';
	}

	render () {
		const options = this.props.options;	
		const props   = {
			title     : options.title,
			count     : options.count,
			iconClass : options.iconClass,
			desc      : options.desc,
		};

		return (
			pug`
				.animated.flipInY
					.tile-stats
						.icon
							i(className='fa '+props.iconClass)
						.count #{props.count}
						h3 #{props.title}
						p #{props.desc}
			`
		);
	}
}

export default statWidget;
