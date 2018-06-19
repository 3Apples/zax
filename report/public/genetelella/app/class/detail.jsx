import $                   from 'jquery';
import React               from 'react';
import {Link}              from 'react-router-dom';
import moment              from 'moment';
import xhr                 from '../common/xhr';
import MainDetails         from '../components/class/detail.jsx'
import ClassAudit          from '../components/class/audit.jsx'
import JSONView            from '../components/misc/jsonview.jsx'

class ClassDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error  : null,
			_class : null
		};

		this.onDelete = this.onDelete.bind(this);
	}

	fetch () {
		var class_id = this.props.match.params.class_id;
		var _this = this;

		xhr.get ('/vc-admin/class/details/' + class_id)
			.then (
				(info) => {
					_this.setState ({
						error  : null,
						_class : info
					});
				}
			)
			.fail (
				(err) => {
					_this.setState ({
						error  : err,
						_class : null
					});
				}
			);

	}

	componentDidMount () {
		this.fetch ()
	}

	onDelete () {
		this.fetch ();
	}

	render() {
		var class_detail = this.state._class;

		if (!class_detail)
			return null;

		return (
			pug`
			.row
				.col-md-6.col-sm-12.col-xs-12
					.x_panel
						MainDetails(classDetail=${class_detail}, onDelete=${this.onDelete})
					.x_panel
						JSONView(obj=${class_detail})
				.col-md-6.col-sm-12.col-xs-12
					.x_panel
						ClassAudit(classDetail=${class_detail})
			`
		);
	}
}

export default ClassDetail;
