import React        from 'react';

class LicenseCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount () {
		if (!this.props.heading)
			throw 'heading is required';
		if (!this.props.percentage && this.props.percentage !== 0)
			throw 'percentage is required';
		if (!this.props.state)
			throw 'state is required';
	}

	render () {
		const styleDiv = {
			textAlign    : 'center',
			marginBottom : '17px'
		};

		const props = {
			heading       : this.props.heading,
			percentage    : this.props.percentage || 0,
			state         : this.props.state || '-',
			name          : this.props.name || '-',
			body          : this.props.body || '',
		};

		return (
			pug`
			.widget.widget_tally_box
				.x_panel.fixed_height_390
					.x_title
						h3 #{props.heading} 
						.clearfix
					.x_content
						div(style=styleDiv)
							span.chart( ref='donut' data-percent=props.percentage)
								span.percent #{props.percentage}
								canvas(height='110', width='110')
						h3.name_title #{props.state}
						p #{props.name}
						.divider
						p
							| #{props.body}			`
		);
	}
}

export default LicenseCard;
