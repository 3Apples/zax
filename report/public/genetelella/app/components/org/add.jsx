var $ = require ('jquery');

import React       from 'react';
import moment      from 'moment';
import xhr         from '../../common/xhr';
import Input       from '../misc/input.jsx';
import { Breadcrumb } from 'react-breadcrumbs';

class OrgAddForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error           : null,
			name            : null,
			abbrev          : null,
			description     : null,
			email           : null,
			address_1       : null,
			address_2       : null,
		};

		this.submitBtn     = React.createRef();
		this.errXHR        = React.createRef();
		this.okXHR         = React.createRef();

		this.submit        = this.submit.bind(this);
		this.check         = this.check.bind(this);
		this.checkTextArea = this.checkTextArea.bind(this);
	}

	hasValue (item) {
		return item && item.length;
	}

	toggleSubmit () {
		var state = this.state;

		if (this.hasValue (state.name) &&
			this.hasValue (state.abbrev) && 
			this.hasValue (state.description) && 
			this.hasValue (state.email)
		) {
			$(this.submitBtn.current).removeClass('disabled');
			return;
		}

		if (!$(this.submitBtn.current).hasClass('disabled'))
			$(this.submitBtn.current).addClass('disabled');
	}

	check (event) {
		var key   = event.key;
		var value = event.value;
		var _set  = {};

		if (key.match (/address_1/g)) {
			_set.address_1 = this.state.address_1 || {
										name     : 'Address 1',
										line1    : '',
										line2    : '',
										district : '',
										state    : '',
										country  : 'India',
										pincode  : '',
										contact  : ''
									};
			_set.address_1 [key.split('/')[1]] = value;
		}
		else if (key.match (/address_2/g)) {
			_set.address_2 = this.state.address_1 || {
										name     : 'Address 2',
										line1    : '',
										line2    : '',
										district : '',
										state    : '',
										country  : 'India',
										pincode  : '',
										contact  : ''
									};
			_set.address_2 [key.split('/')[1]] = value;
		}
		else {
			_set [key] = value;
		}

		this.setState (_set, () => this.toggleSubmit ());
	}

	checkTextArea (event) {
		var value = event.target.value;

		this.setState ({ description : value }, () => this.toggleSubmit ());
	}

	submit (event) {
		event.preventDefault();

		var data = {
			name        : this.state.name,
			abbrev      : this.state.abbrev,
			description : this.state.description,
			email       : this.state.email,
			addresses   : [],
		};

		if (this.state.address_1) {
			data.addresses.push (this.state.address_1);
		}
		if (this.state.address_2) {
			data.addresses.push (this.state.address_2);
		}

		$(this.submitBtn.current).addClass('disabled');
		$(this.okXHR.current).css('display', 'none');
		$(this.errXHR.current).css('display', 'none');

		xhr.post ('/vc-admin/org/add', data)
			.then (() => {
					$(this.submitBtn.current).removeClass('disabled');
					$(this.okXHR.current).html('organization "' + this.state.name + '" created ok');
					$(this.okXHR.current).css('display', 'block');

					if (this.props.callback)
						return this.props.callback (null, this.state);
				}
			)
			.fail ((err) => {
				console.error ('error :' + err);
				$(this.submitBtn.current).removeClass('disabled');
				$(this.errXHR.current).html(err);
				$(this.errXHR.current).css('display', 'block');
			});
	}

	render() {

		return (
		<Breadcrumb data={{
			title    : 'Add',
			pathname : '/vc-admin/org/add'
		}}>
			<div className="row">
				<div className="col-md-12 col-sm-12 col-xs-12">
					<div className="x_panel">
						<div className="x_content">
							<h4>Add a new Organization</h4>
							<br />
						</div>
						<div className="x_content">
							<form>
								<div className="row">
									<div className="col-md-6 col-sm-6 form-group">
										<Input type="text" className="form-control" placeholder="Organization Name" _key="name" onChange={this.check}/>
									</div>
									<div className="col-md-2 col-sm-2 form-group">
										<Input type="text" className="form-control" placeholder="Abbreviation" _key="abbrev" onChange={this.check}/>
									</div>
									<div className="col-md-4 col-sm-4 form-group">
										<Input type="text" className="form-control" placeholder="Contact Email" _key="email" onChange={this.check}/>
									</div>
								</div>

								<div className="row">
									<div className="col-md-12 col-sm-12 form-group">
										<textarea rows="4" className="form-control" placeholder="Description" _key="description" onChange={this.checkTextArea}/>
									</div>
								</div>

								<div className="row">
									<div className="col-md-6 col-sm-6 form-group">
										<label> Address 1 </label>
										<Input type="text" className="form-control" placeholder="Address Line 1" _key="address_1/line1" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="Address Line 2" _key="address_1/line2" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="District" _key="address_1/district" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="State" _key="address_1/line1" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="Pincode" _key="address_1/pincode" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="India" disabled={true} value="India" _key="address_1/country" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="Phone/Mobile #" _key="address_1/contact" onChange={this.check}/>
									</div>
									<div className="col-md-6 col-sm-6 form-group">
										<label> Address 2 </label>
										<Input type="text" className="form-control" placeholder="Address Line 1" _key="address_2/line1" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="Address Line 2" _key="address_2/line2" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="District" _key="address_2/district" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="State" _key="address_2/line1" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="Pincode" _key="address_2/pincode" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="India" disabled={true} value="India" _key="address_2/country" onChange={this.check}/>
										<Input type="text" className="form-control" placeholder="Phone/Mobile #" _key="address_2/contact" onChange={this.check}/>
									</div>
								</div>

								<br></br>
								<div className="row">
									<div className="col-md-4 col-sm-4 form-group">
										<div >
											<button type="button" className="btn btn-primary disabled" ref={this.submitBtn} onClick={this.submit}>
												Add !
											</button>
										</div>
									</div>
								</div>
								<div className="row">
									<span className="text-danger col-md-12" id="xhr-error" style={{'display' : 'none'}} ref={this.errXHR}/>
									<span className="text-success col-md-12" id="xhr-error" style={{'display' : 'none'}} ref={this.okXHR}/>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</Breadcrumb>
	);
	}
}

export default OrgAddForm;
