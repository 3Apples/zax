define(function(require) {
	var $           = require('jquery');
	var moment      = require('moment');
	var React       = require('react');
	var moment      = require('moment');
	var xhr         = require('../../common/xhr');

	class Password extends React.Component {

		constructor(props) {
			super(props);
			this.state = {
				match     : 'initial',
				password  : null,
				value_1   : null,
				value_2   : null,
			};

			this.input_1       = React.createRef()
			this.input_2       = React.createRef()

			this.check_1     = this.check_1.bind(this);
			this.check_2     = this.check_2.bind(this);
			this.getPassword = this.getPassword.bind(this);
		}

		hasValue (item) {
			return item && item.length;
		}

		getPassword () {
			if (this.state.match === 'matched')
				return this.state.password;

			return null;
		}

		checkState () {

			if (this.state.value_1 != this.state.value_2) {
				this.setState ({ match : 'mismatch' });

				$(this.input_1.current).closest('.form-group').removeClass('has-success');
				$(this.input_2.current).closest('.form-group').removeClass('has-success');
				$(this.input_1.current).closest('.form-group').addClass('has-error');
				$(this.input_2.current).closest('.form-group').addClass('has-error');

				return this.props.onChange && this.props.onChange (null);
			}

			/* Else the passwords match or they are both empty */
			if (!this.state.value_1 || !this.state.value_1.length) {
				this.setState ({ match : 'initial' });

				$(this.input_1.current).closest('.form-group').removeClass('has-success');
				$(this.input_2.current).closest('.form-group').removeClass('has-success');
				$(this.input_1.current).closest('.form-group').addClass('has-error');
				$(this.input_2.current).closest('.form-group').addClass('has-error');

				return this.props.onChange && this.props.onChange (null);
			}

			this.setState ({ match : 'matched', password : this.state.value_1 }, function () {
				$(this.input_1.current).closest('.form-group').removeClass('has-error');
				$(this.input_2.current).closest('.form-group').removeClass('has-error');
				$(this.input_1.current).closest('.form-group').addClass('has-success');
				$(this.input_2.current).closest('.form-group').addClass('has-success');

				return this.props.onChange && this.props.onChange (this.state.password);
			});
		}

		check_1 (event) {
			var value = event.target.value;

			this.setState ({ value_1 : value }, () => {
				this.checkState ();
			});
		}

		check_2 (event) {
			var value = event.target.value;

			this.setState ({ value_2 : value }, () => {
				this.checkState ();
			});
		}


		render() {

			return (
					<div className="row">
						<div className="col-md-6 col-sm-6 form-group">
							<input
								type="password"
								className="form-control"
								placeholder="Password"
								onChange={this.check_1}
								ref={this.input_1}
								readOnly={this.props.readOnly ? true : false}
							/>
						</div>
						<div className="col-md-6 col-sm-6 form-group">
							<input
								type="password"
								className="form-control"
								placeholder="Repeat Password"
								onChange={this.check_2}
								ref={this.input_2}
								readOnly={this.props.readOnly ? true : false}
							/>
						</div>
					</div>
			);
		}
	}

	return Password;
});
