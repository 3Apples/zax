import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import xhr         from '../../common/xhr';
import Input       from '../misc/input-form-group.jsx';
import Select      from '../misc/select.jsx';

class LicenseAddForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			xhrStatus       : 'init',
			errString       : null,
			name            : null,
			maxHours        : null,
			maxConcurrency  : null,
			maxAttendees    : null,
			licenseDuration : null,
			submitEnabled   : false,
			inputsValidity  : {}
		};

		this.check       = this.check.bind (this);
		this.submit      = this.submit.bind (this);
	}

	hasValue (item) {
		return item && item.length;
	}

	toggleSubmit () {
		var state = this.state;
		if (this.hasValue (state.name) &&
			state.maxHours && 
			state.maxConcurrency && 
			state.maxAttendees && 
			state.licenseDuration && this.areInputsValid () ) {
			
			this.setState ({ submitEnabled : true });
			return;
		}

		this.setState ({ submitEnabled : false });
	}

	submit (event) {
		event.preventDefault ();
		var _this = this;
		
		if (!this.state.submitEnabled)
			return;

		this.setState({ submitEnabled : false, xhrStatus : 'submitting', errString : null }, function () {

			var data = {
				name            : this.state.name,
				maxHours        : this.state.maxHours,
				maxConcurrency  : this.state.maxConcurrency,
				maxAttendees    : this.state.maxAttendees,
				licenseDuration : this.state.licenseDuration,
			};

			xhr.post ('/vc-admin/lic/template/add', data)
				.then (() => {
					_this.setState({ submitEnabled : true, xhrStatus : 'success', errString : null });

					if (this.props.callback)
						return this.props.callback (null, this.state);
				})
				.fail ((err) => {
					_this.setState({ submitEnabled : true, xhrStatus : 'error', errString : err });
				});
		});
	}

	check (event) {
		var key         = event.key;
		var value       = event.value;
		var isValid     = Boolean(event.isValid);
		var _set  = {};
		var state;

		var temp = this.state.inputsValidity;
		temp[key] = isValid;
		
		_set.inputsValidity = temp;
		_set[key] = value;

		this.setState (_set, () => this.toggleSubmit ());
	}
	
	areInputsValid () {
		var result = true;
		var validity = this.state.inputsValidity;
		for (var key in validity) {
			result = result && validity[key];
		}
		return result;
	}
	render() {

		return (
			<div className="row">
				<div className="col-md-12 col-sm-12 col-xs-12">
					<div className="x_panel">
						<div className="x_content">
							<h4>Add a new License Archetype</h4>
							<br />
						</div>
						<div className="x_content">
							<form>
								<div className="row">
									<div className="col-md-4 col-sm-4 form-group">
										<Input _key='name' type="text" placeholder="Archetype License Name" onChange={ this.check } validate={ new RegExp(/^[a-zA-Z0-9\s]+$/g) } errorMessage="only alphanumerics and spaces are allowed"/> 
									</div>
									<div className="col-md-4 col-sm-4 form-group">
										<Input _key='maxHours' type="number" min="0" max="10000" placeholder="Max monthly hours" onChange={ this.check } validate={ new RegExp(/^[0-9]+$/g) } errorMessage="only numbers upto 10000 are allowed"/> 
									</div>
									<div className="col-md-4 col-sm-4 form-group">
										<Input _key='maxConcurrency' type="number" min="0" max="99" placeholder="Max concurrent classes" onChange={ this.check } validate={ new RegExp(/^[0-9]+$/g) } errorMessage="only numbers upto 99 are allowed"/> 
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-sm-4 form-group">
										<Input _key='maxAttendees' type="number" min="0" max="100" placeholder="Max Attendees per class" onChange={ this.check } validate={ new RegExp(/^[0-9]+$/g) } errorMessage="only numbers upto 100 are allowed"/> 
									</div>
									<div className="col-md-4 col-sm-4 form-group">
										<Input _key='licenseDuration' type="number" min="0" placeholder="License Duration in days" onChange={ this.check } validate={ new RegExp(/^[0-9]+$/g) } errorMessage="only numbers greater than 0 are allowed"/> 
									</div>
									<div className="col-md-4 col-sm-4 form-group">
										<div>
											<select id="profiles" className="form-control" disabled>
												<option value="default">default</option>
											</select>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-sm-4 form-group">
										<button type="button" className={ "btn btn-primary " + (this.state.submitEnabled ? '' : 'disabled')} onClick={this.submit}>
											Add !
										</button>
									</div>
								</div>
							</form>
							<div className="row">
								{ this.state.xhrStatus == 'submitting' && 
									<div>
										<span className="fa fa-spinner fa-spin"> </span> 
										<span> Connecting to server ...  </span> 
									</div>
								}
								{ this.state.errString && <span className="text-danger col-md-12"> {this.state.errString} </span>}
								{ this.state.xhrStatus == 'success' && <span className="text-success col-md-12"> Archetype "{this.state.name}" created ok </span>}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
}

export default LicenseAddForm;
