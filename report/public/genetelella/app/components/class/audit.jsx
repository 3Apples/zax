import $           from 'jquery';
import React       from 'react';
import moment      from 'moment';
import xhr         from '../../common/xhr';
import { durationPretty }  from '../../common/time';

class ClassDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error : null,
			data  : null,
		};

		this.refUrl      = React.createRef();
		this.refJoinBtn  = React.createRef();
		this.refDeleteBtn  = React.createRef();
		this.refDeleteOK  = React.createRef();
		this.refDeleteErr  = React.createRef();
	}

	componentDidMount () {
		var class_id = this.props.classDetail.class_id;
		var _this = this;

		xhr.get ('/vc-admin/class/audit/' + class_id)
			.then (
				(__data) => { _this.setState ({ error : null, data : __data }) },
				(err) => { _this.setState ({ error : err, data : null })}
			);
	}

	generateRows () {
		return this.state.data.map ((item, index) => {
			var info;

			switch (item.name) {
				case 'created':
				case 'locked':
				case 'unlocked':
				case 'cooked':
					info = '-';
					break;
				case 'status-changed':
					info = item.data.status;
					break;
				case 'artefacts':
					info = item.data;
					break;
				case 'docker':
					info = item.data.event || '* WTF *' + JSON.stringify (item.data);
					break;
				default:
					info = '???';
					break;
			}

			return pug`
				tr(key=${index})
					td ${ moment (item.ts).format ('YYYY MMM DD hh:mm.SSS a') }
					td ${ item.name }
					td ${ info }
			`;
		});
	}

	render() {
		if (!this.state.data)
			return null;

		return (
			pug`
				.x_title
					h3 Events Audit Trail
					.clearfix
				.x_content
					.row
						.col-md-12.text-center
							if ${!this.state.error && !this.state.data}
								p.fa.fa-spinner.fa-spin
							if ${this.state.error}
								p.text-danger ${this.state.error}
					.row
						.col-md-12
							table.table.table-condensed.table-striped
								thead
									tr
										th Time
										th Event
										th Event Info
								tbody
									${ this.generateRows () }
					.clearfix
			`
		);
	}
}

export default ClassDetail;
