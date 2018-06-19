define(function(require) {
	var React       = require('react');

	class Input extends React.Component {

		constructor(props) {
			super(props);
			this.state = {
				error  : null,
				value  : null,
			};

			this.callback  = this.callback.bind(this);
		}

		callback (event) {
			var value = event.target.value;

			if (!value.match (this.props.validate)) {
				this.setState ({ value : value, error : true }, () => {
					this.props.onChange ({ key : this.props._key, value : value, isValid : !this.state.error });
				});

				return;
			}

			if (!this.isBetweenMinMax (value)) {
				this.setState ({ value : value, error : true }, () => {
					this.props.onChange ({ key : this.props._key, value : value, isValid : !this.state.error });
				});

				return;
			}

			/* Else everything is fine */
			this.setState ({ value : value, error : null }, () => {
				this.props.onChange ({ key : this.props._key, value : value, isValid : !this.state.error });
			});
		}
		
		isBetweenMinMax (value) {
			if (this.props.min && parseInt(value) < this.props.min)
				return false;
			if (this.props.max && parseInt(value) > this.props.max)
				return false;
			return true;
		}

		render() {

			if (!this.props.disabled && !this.props._key)
				throw 'Input needs _key';

			if (!this.props.disabled && !this.props.onChange)
				throw 'Input needs onChange callback';

			if (!this.props.disabled && !this.props.errorMessage)
				throw 'Input needs an errorMessage';

			if (!this.props.disabled && !this.props.validate)
				throw 'Input needs validate regular expression';

			var formGroupClass = this.state.value && this.state.value.length && (this.state.error ? 'has-error' : 'has-success') || '';

			return (
				<div className={"form-group " + formGroupClass}>
					<input
						type={this.props.type}
						min={this.props.min}
						max={this.props.max}
						disabled={this.props.disabled}
						value={this.props.value}
						className='form-control'
						placeholder={this.props.placeholder}
						onChange={this.callback}
					/>
					<span
						className="text-danger" 
						style={{'display' : this.state.value && this.state.error ? 'inline-block' : 'none'}}
						>
							{this.props.errorMessage}
					</span>
				</div>
			);
		}
	}

	return Input;
});
