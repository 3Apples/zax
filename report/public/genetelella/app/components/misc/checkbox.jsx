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
			boxes  : {}
		};

		props.values.forEach ((curr) => {
			this.state.boxes[curr.value] = { checked : curr.checked }
		});

		this.callback = this.callback.bind(this);
	}

	callback (event) {
		var value   = event.target.value;
		var checked = event.target.checked;
		var boxes   = this.state.boxes;

		if (this.props.readOnly)
			return false;

		boxes[value].checked = checked ? true : false;

		this.setState ({ boxes : boxes }, () => {
			this.props.onChange ({ key : this.props._key, value : this.state.boxes });
		});
	}

	render() {

		return (
			pug`
				${this.props.values.map((item) => pug`
					.pretty.p-default.p-fill(key=${item.value})
						input(type="checkbox", name=${this.props._key}, value=${item.value}, onChange=${this.callback}, checked=${this.state.boxes[item.value].checked})

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
