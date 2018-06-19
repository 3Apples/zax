import $           from 'jquery';
import React       from 'react';
import moment      from 'moment';
import '../../../vendors/jquery-jsonview/jquery.jsonview.min.js';
import '../../../vendors/jquery-jsonview/jquery.jsonview.min.css';

class JSONview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data  : null,
		};

		this.refAnchor = React.createRef ();
	}

	componentDidMount () {
		var details = this.props.obj;

		$(this.refAnchor.current).JSONView(details);
		$(this.refAnchor.current).JSONView('collapse', 1);
	}

	render() {
		return (
			pug`
				.x_title
					h3 ${this.props.title || 'Gory Details'}
					.clearfix
				.x_content
					.row
						.col-md-12(style=${{ wordWrap : 'break-word' }})
							div(ref=${this.refAnchor})
					.clearfix
			`
		);
	}
}

export default JSONview;
