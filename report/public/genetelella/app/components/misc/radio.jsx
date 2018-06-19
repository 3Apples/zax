import React  from 'react';
import '../../less/pretty-checkbox.scss';

class Checkboxes extends React.Component {

	constructor(props) {
		super(props);

		if (!props._key)
			throw '_key needed';
		if (!props.onChange)
			throw 'onChange needed';

		this.state = {
			value  : null,
		};

		this.callback = this.callback.bind(this);
	}

	callback (event) {
		var value   = event.target.value;

		this.setState ({ value : value }, () => {
			if (!this.props.readOnly)
				this.props.onChange ({
					key     : this.props._key,
					value   : this.state.value,
				});
		});
	}

	render() {

		if (!this.props.values.length)
			return null;

		return (
			pug`
				${this.props.values.map((item) => pug`
					.pretty.p-default.p-round.p-fill(key=${item.value})
						input(type="radio", name=${this.props._key}, value=${item.value} onChange=${this.callback}, checked=${item.checked})

						if (this.props.readOnly)
							.state.p-primary
								label ${item.label}
						else
							.state.p-danger
								label ${item.label}
					`)}
			`
		);
	}
}

export default Checkboxes;
