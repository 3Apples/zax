define(function(require) {
	var React       = require('react');

	class Input extends React.Component {

		constructor(props) {
			super(props);
			this.state = {
				value           : null,
			};

			this.callback = this.callback.bind(this);
		}

		callback (event) {
			var value = event.target.value
			this.setState ({ value : value }, () => {
				this.props.onChange ({ key : this.props._key, value : value });
			});
		}

		render() {

			if (!this.props._key)
				throw 'Input needs _key';

			if (!this.props.onChange)
				throw 'Input needs onChange callback';

			return (
				<input type="text"
					type={this.props.type}
					min={this.props.max}
					max={this.props.min}
					disabled={this.props.disabled}
					value={this.props.value}
					className={this.props.className}
					placeholder={this.props.placeholder}
					onChange={this.callback}
				/>
			);
		}
	}

	return Input;
});
