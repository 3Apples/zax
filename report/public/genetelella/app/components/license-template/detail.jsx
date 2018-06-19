import $           from 'jquery';
import React       from 'react';
import xhr         from '../../common/xhr';
	
class LicenseTemplateDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			loadRender: false,
			items: []
		};

		this.update_list = this.update_list.bind(this);
	}

	componentDidMount () {
		this.update_list (this.props.match.params._id);
	}

	update_list (_id) {
		xhr.get (`/vc-admin/lic/template/get/${_id}`)
		.then(
			(result) => {
				this.setState({
					loadRender: true,
					items: result
				});
			},
			(error) => {
				this.setState({
					loadRender: true,
					error:    error,
				});
			}
		);
	}

	render() {

		return (
			<div className="row">
				<div className="col-xs-12">
					<div className="x_panel">
						<div className="x_content">
							<h4>License Archetype Details</h4>
							<br />
						</div>
						<div className="x_content">
							<table id="table-archetype-detail" className="table table-condensed table-striped">
								<tbody>
									<tr>
										<td>ID</td>
										<td>{this.state.items._id}</td>
									</tr>
									<tr>
										<td>Name</td>
										<td>{this.state.items.name}</td>
									</tr>
									<tr>
										<td>Max honthly hours</td>
										<td>{this.state.items.maxHours}</td>
									</tr>
									<tr>
										<td>Max concurrency</td>
										<td>{this.state.items.maxConcurrency}</td>
									</tr>
									<tr>
										<td>Max attendees</td>
										<td>{this.state.items.maxAttendees}</td>
									</tr>
									<tr>
										<td>License Duration (Days)</td>
										<td>{this.state.items.licenseDuration}</td>
									</tr>
									<tr>
										<td>Created By</td>
										<td>{this.state.items.createdBy}</td>
									</tr>
									<tr>
										<td>Created Timestamp</td>
										<td>{this.state.items.createdTs}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LicenseTemplateDetail;
