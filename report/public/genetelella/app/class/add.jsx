import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import xhr         from '../common/xhr';
import datetime    from '../../vendors/bootstrap-datetimepicker/js/bootstrap-datetimepicker';
import '../../vendors/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';
import ReactSimpleRange from 'react-simple-range';
import UserSelect  from '../components/misc/select.jsx';

class ClassForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			error         : null,
			creating      : false,
			success_str   : null,
			title         : null,
			start_ts      : null,
			duration      : 60,
			duration_ui   : 60,
			duration_max  : 420,
			now           : false,
			description   : null,
			profile       : 'default',
			presenters    : [],
			submitDisabled: true,
		};

		this.onTitle = this.onTitle.bind(this);
		this.onDateTime = this.onDateTime.bind(this);
		this.onNowBtn = this.onNowBtn.bind(this);
		this.onDescription = this.onDescription.bind(this);
		this.onProfile = this.onProfile.bind(this);
		this.onPresenter = this.onPresenter.bind(this);
		this.onDuration = this.onDuration.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.refDateTimeInput = React.createRef();
	}

	hasValue (item) {
		if (typeof item === 'string')
			return item && item.length;
		return item;
	}

	toggleSubmit () {
		var state = this.state;

		if (this.hasValue (state.title) &&
			this.hasValue (state.start_ts) &&
			this.hasValue (state.description) &&
			this.hasValue (state.duration) &&
			this.hasValue (state.profile)
		   ) {
			   this.setState({ submitDisabled : false });
			   return;
		   }

		   this.setState({ submitDisabled : true });
	}

	onTitle (event) {
		var value = event.target.value;
		this.setState ({ title : value }, this.toggleSubmit);
	}

	onDateTime (value) {
		this.setState ({ start_ts : moment(value).toISOString() }, this.toggleSubmit);
	}

	onNowBtn (event) {
		var newState = !this.state.now;
		var start_ts = newState ? moment().toISOString() : null;

		event.preventDefault();

		this.setState ({ start_ts : start_ts, now : newState }, () => {

			/* Also, clear the datetime input */
			if (newState) {
				$(this.refDateTimeInput.current).val(null);
				$(this.refDateTimeInput.current).datetimepicker('update');
			}

			this.toggleSubmit ();
		});

		return false;
	}

	onProfile (event) {
		var value = event.target.value;
		this.setState ({ profile : value }, this.toggleSubmit);
	}

	onDuration (event) {
		var value = event.value;
		var visible_value = value;

		/* If this is a perma class */
		if (value == this.state.duration_max + 1) 
			value = -1;

		this.setState ({ duration : value, duration_ui : visible_value }, this.toggleSubmit);

		return;
	}

	onPresenter (event) {
		var values = event.values;

		this.setState ({ presenters : values }, this.toggleSubmit);
	}

	onDescription (event) {
		var value = event.target.value;
		this.setState ({ description : value }, this.toggleSubmit);
	}

	componentDidMount () {
		$(this.refDateTimeInput.current).datetimepicker({
			format: "dd MM yyyy - HH:ii P",
			autoclose: true,
			todayBtn: true,
			showMeridian: true,
			pickerPosition: "bottom-left",
			todayHighlight : true,
			startDate : new Date(),
		});

		var _this = this;
		$(this.refDateTimeInput.current).datetimepicker().on('changeDate', function (ev) {
			_this.onDateTime (ev.date);
		});
	}

	onSubmit () {
		var params = {
			profile   : this.state.profile,
			meta_info : {
				title       : this.state.title,
				description : this.state.description,
			},
			time_spec : {
				starts   : this.state.now ? 'now' : this.state.start_ts,
				duration : this.state.duration,
			},
			attendees : {
				named : this.state.presenters.map ((curr) => {
					return {
						id       : curr.value.split('/')[0],
						auth_via : curr.value.split('/')[1],
						role     : 'presenter'
					};
				}),
			},
		};

		var _this = this;
		this.setState ({ creating : true, success_str : null, error : null }, function () {
			xhr.post ('/vc-admin/class/create/', params)
				.then (
					(_data) => {
						_this.setState ({ creating : false, error : null, success_str : 'presentation created (id = ' + _data.class_id + ')' });
						this.props.history.push('/vc-admin/');
					},
					(err  ) => { _this.setState ({ creating : false, error : err,  success_str : null });}
				);
		});
	}

	render() {

		return (
		pug`
			.row
				.col-md-12.col-sm-12.col-xs-12
					.x_panel
						.x_title
							h3 Create a Presentation
						.x_content
							form(role="form")
								.row
									.col-md-6.col-sm-6.col-xs-12
										label Title *
										input.form-control(type="input", placeholder="Presentation Title", onChange=${this.onTitle})

									.form-group.col-md-6.col-sm-6.col-xs-12
										label Start Time *
										.row
											.col-md-6.col-sm-6.col-xs-12(style=${{ display : this.state.now ? 'none' : 'inline-block' }})
												input.form-control(size=16, type="text", value="Schedule Time", readOnly ref=${this.refDateTimeInput})
											.col-md-6.col-sm-6.col-xs-12
												button.btn.form-control(onClick=${this.onNowBtn}, className=${this.state.now ? 'btn-danger' : 'btn-info'})
													span.fa.fa-bolt(style=${{ marginRight : '8px' }})
													span ${this.state.now ? 'Scheduled for now' : 'Schedule for now'}

								.row
									.col-md-6.col-sm-6.col-xs-12
										.form-group
											label Description *
											textarea.form-control(rows="3", placeholder="Presentation Description", style=${{ height : '102px' }}, onChange=${this.onDescription})
									.col-md-6.col-sm-6.col-xs-12
										.row
											.col-md-6.col-sm-6.col-xs-12
												.form-group
													label Duration
													ReactSimpleRange(min=${1}, max=${this.state.duration_max + 1}, step=${30}, value=${this.state.duration_ui} onChange=${this.onDuration})
													span Duration set to ${this.state.duration == -1 ? 'forever' : this.state.duration + ' minutes'}
											.col-md-6.col-sm-6.col-xs-12
												.form-group
													label Profile
													input#profile.form-control(type="input", value="default", readOnly, style=${{ height : 'initial' }}, onChange=${this.onProfile})
										.row
											.col-md-12.col-sm-12.col-xs-12
												.form-group
													label Presenter(s)
													UserSelect(
														value=${this.state.presenters}
														isMulti,
														_key="presenter",
														placeholder="Presenter(s)",
														onChange=${this.onPresenter},
														url='/vc-admin/user/list',
														mapper=${ (curr) => { return { label : curr.firstName + ' ' + curr.lastName, value : curr.id.replace(/:/g, '/')}; } }
													)

							.row
								.col-md-12
									button.btn.btn-danger.btn-lg(onClick=${this.onSubmit}, disabled=${this.state.submitDisabled}) तथास्तु	
									span &nbsp
									span.fa.fa-spinner.fa-spin.fa-2x#loading(style=${{ display : 'none' }})
								.clearfix

							.row
								.col-md-12
									span.fa.fa-spinner.fa-spin(style=${{ display : this.state.creating ? 'inline-block' : 'none' }})
									span(style=${{ display : this.state.creating ? 'inline-block' : 'none' }}) &nbsp Sending request to server ...
									span.text-success(style=${{ display : this.state.success_str ? 'block' : 'none' }}) ${this.state.success_str}
									span.text-danger(style=${{ display : this.state.error ? 'block' : 'none' }}) ${this.state.error}
								.clearfix
			`
		);
	}
}

export default ClassForm;
