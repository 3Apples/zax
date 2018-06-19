import $              from 'jquery';
import moment         from 'moment';
import React          from 'react';
import ReactDOM       from 'react-dom';
import xhr            from '../../common/xhr';
import CustomSelect   from '../misc/select.jsx';
import 'react-select/dist/react-select.css';

class LicInstanceAddForm extends React.Component {

	constructor (props) {
		super (props);
		this.state = {
			xhrStatus     : 'init',
			errString     : null,
			template      : null,
			org           : null,
			submitEnabled : false,
		};

		this.check       = this.check.bind (this);
		this.submit      = this.submit.bind (this);
	}
	
	hasValue (item) {
		return item && item.length;
	}

	toggleSubmit () {
		var state = this.state;

		if (this.state.template &&
			this.state.org &&
			this.hasValue(state.template.value) &&
			this.hasValue(state.org.value)) {

			this.setState ({ submitEnabled : true });
			return;
		}

		this.setState ({ submitEnabled : false });
	}

	check (event) {
		var key   = event.key;
		var value = event.value;
		var _set  = {};
		var state;

		_set[key] = value;
		this.setState (_set, () => this.toggleSubmit ());
	}

	submit (event) {
		event.preventDefault ();
		var _this = this;
		
		if (!this.state.submitEnabled)
			return;

		this.setState({ submitEnabled : false, xhrStatus : 'submitting', errString : null }, function () {

			var data = {
				org      : this.state.org.value, 
				template : this.state.template.value 
			};

			xhr.post ('/vc-admin/lic/instance/add', data)
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

	render() {
		
		return (
			<div className="row">
				<div className="col-md-12 col-sm-12 col-xs-12">
					<div className="x_panel">
						<div className="x_content">
							<h4>Add a new License Instance</h4>
						</div>
						<div className="x_content">
							<form>
								<div className="row">
									<div className="col-md-4 col-sm-6 form-group">
										<CustomSelect value={this.state.org} _key="org" placeholder="Select Organization" onChange={this.check}
											url='/vc-admin/org/list'
											mapper={(curr) => { return { label : curr.name, value : curr._id }}}
										/>
									</div>
									<div className="col-md-4 col-sm-6 form-group">
										<CustomSelect value={this.state.template} _key="template" placeholder="Select Archetype" onChange={this.check}
											url='/vc-admin/lic/template/list'
											mapper={(curr) => { return { label : curr.name, value : curr._id }}}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-2 col-sm-2 form-group">
										<div >
											<button type="button" className={ "btn btn-primary " + (this.state.submitEnabled ? '' : 'disabled')} onClick={this.submit}>
												Create !
											</button>
										</div>
									</div>
								</div>
							</form>
							<div className="row">
								{this.state.xhrStatus == 'submitting' && 
									<div>
										<span className="fa fa-spinner fa-spin"> </span> 
										<span> Connecting to server ...  </span> 
									</div>
								}
								{this.state.errString && <span className="text-danger col-md-12"> {this.state.errString} </span>}
								{this.state.xhrStatus == 'success' && <span className="text-success col-md-12"> License Instance created for "{this.state.org.label} " of type "{this.state.template.label}"</span>}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LicInstanceAddForm;
