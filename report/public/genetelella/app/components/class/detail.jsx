import $           from 'jquery';
import React       from 'react';
import moment      from 'moment';
import xhr         from '../../common/xhr';
import { durationPretty }  from '../../common/time';
import Resolve from '../../components/misc/resolve.jsx';

class ClassDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			url       : null,
			urlError  : null,
			delBtn    : {
				status : 'idle',
				ok     : null,
				error  : null,
			},
		};

		this.deleteClass = this.deleteClass.bind(this);
	}

	componentDidMount () {
		var class_id = this.props.classDetail.class_id;
		var _this = this;

		/* Now get the URL */
		xhr.get ('/vc-admin/class/get-urls/' + class_id)
			.then (
				(urls) => {
					_this.setState ({ urlError : null, url : urls.main });
				}
			)
			.fail (
				(err) => {
					_this.setState ({
						url       : null,
						urlError  : err
					});
				}
			);

	}

	deleteClass () {
		var class_id = this.props.classDetail.class_id;
		var _this = this;

		if (this.props.classDetail.removed)
			return;

		this.setState ({
			delBtn : {
				status : 'deleting',
				ok     : null,
				error  : null
			}
		}, () => {
			xhr.delete ('/vc-admin/class/' + class_id)
				.then (
					(__data) => {
						_this.setState ({
							delBtn : {
								status : 'idle',
								ok     : true,
								error  : null,
							}
						}, () => {
							_this.props.onDelete();
						});
					},
					(err) => {
						_this.setState ({
							delBtn : {
								status : 'idle',
								ok     : null,
								error  : err,
							}
						});
					}
				);
		});

	}

	render() {
		var class_detail = this.props.classDetail;

		if (!class_detail)
			return null;

		var status           = class_detail.removed ? 'removed' : class_detail.status;
		var start_ts         = (class_detail.provisioning &&
								class_detail.provisioning.time_spec &&
								class_detail.provisioning.time_spec.actual_start_time) ||
								class_detail.time_spec.starts;
		var creater_id       = class_detail.meta_info.creator.id + ':' + class_detail.meta_info.creator.auth_via;
		var created_via      = class_detail.meta_info.created_via && class_detail.meta_info.created_via.via || '?';
		var created_via_host = class_detail.meta_info.created_via && class_detail.meta_info.created_via.host || '?';
		var attendees        = class_detail.attendees.named;
		var presenters       = attendees ? attendees.reduce (
									(acc, curr) => { 
										acc.push(curr.role === 'presenter' ? curr.id + ':' + curr.auth_via : '');
										return acc;
									}, []) : [];
		var others           = attendees ? attendees.reduce (
									(acc, curr) => { 
										return acc + (curr.role !== 'presenter' ? curr.id + '/' + curr.auth_via : '') + ' ';
									}, '') : '';

		var can_join   = this.state.url && (
							class_detail.status === 'running' ||
							class_detail.status === 'started'
							);
		var can_delete = !class_detail.removed && class_detail.status === 'scheduled';

		return (
			pug`
				.x_title
					h3 Presentation Details
					.clearfix
				.x_content
					.row
						.col-md-12.col-sm-12.col-xs-12
							h4.fa.fa-quote-left
							h4.text-center(style=${{ width : '100%' }}) ${class_detail.meta_info.title}
							h4.fa.fa-quote-right(style=${{ float : 'right'}})

							table.table.table-condensed.table-striped
								tbody
									tr
										td Description
										td(colSpan=3)
											i ${class_detail.meta_info.description}
									tr
										td Created by
										td 
											Resolve(Id=${creater_id}, profile='User')
										td State
										td(className=${'status-' + status}) 
											b ${status}
									tr
										td Presenters(s)
										td(colSpan=3) 
											${ presenters.map ((item) => pug`
												div(key=${item}, className="text-info")
													Resolve(key=${item}, Id=${item}, profile='User')
														`
											)}

									if ${others && others.trim().length}
										tr
											td Others
											td(colSpan=3)
												b ${others}
									tr
										td Start Time
										td(colSpan=3)
											b ${moment(start_ts).format('DD MMM YYYY, hh:mm a')}
									tr
										td Created @
										td(colSpan=3)
											b ${moment(class_detail.meta_info.creation_ts).format('DD MMM YYYY, hh:mm a')}
									tr
										td Duration
										td 
											b ${durationPretty (class_detail.time_spec.duration, { verbose : true })}
										td Created via
										td
											b ${created_via}
											| &nbsp
											i on ${created_via_host}
									tr
										td Url
										td.class-url(colSpan=3) 
											if ${!this.state.url && !this.state.urlError}
												span.fa.fa-spinner.fa-spin
											else if ${this.state.url}
												a(href=${this.state.url}) ${this.state.url}
											else
												span.text-danger.fa.fa-exclamation-triangle
												span &nbsp
												span ${this.state.urlError}
					.row
						.col-md-12.col-sm-12.col-xs-12(style=${{display: "flex", 'justifyContent': "center"}})
							a.btn.btn-success.col-xs-5(style=${{ fontSize:"28px", color:"white"}}, href=${this.state.url}, target="_blank", className=${can_join ? '':'disabled'})
								span.fa.fa-coffee
								span &nbsp
								span Join Class
							button.btn.btn-danger.col-xs-5(style=${{ fontSize : "28px" }}, onClick=${this.deleteClass}, disabled=${!can_delete})
								span.fa.fa-times
								span &nbsp
								span Delete Class
					.row
						if ${this.state.delBtn.status === 'deleting'}
							.col-md-12.text-center
								span.fa.fa-spinner.fa-spin
								span &nbsp Deleteing ...
						else if ${this.state.delBtn.ok}
							.col-md-12.text-center.text-success
								span Presentation &nbsp
									b ${class_detail.meta_info.title}
								span &nbsp deleted ok
						else
							.col-md-12.text-center.text-danger
								span ${this.state.delBtn.error}

					.clearfix
			`
		);
	}
}

export default ClassDetail;
