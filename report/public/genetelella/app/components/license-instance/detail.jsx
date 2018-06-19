import $           from 'jquery';
import React       from 'react';
import xhr         from '../../common/xhr';
	
class LicenseInstanceDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			loadRender: false,
			instance: {},
			template: {},
			org: {}
		};

		this.update_list = this.update_list.bind(this);
	}

	componentDidMount () {
		this.update_list (this.props.match.params.id);
	}

	update_list (id) {
		xhr.get (`/vc-admin/lic/instance/detail/${id}`)
		.then(
			(result) => {
				this.setState({
					loadRender: true,
					instance: result.instance,
					template: result.template,
					org: result.org,
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
				<div className="col-md-12 col-sm-12 col-xs-12">
					<div className="row">
						<div className="col-md-4 col-sm-6 col-xs-12">
							<div className="x_panel">
								<div className="x_content">
									<h4>License Instance Details</h4>
									<br />
								</div>
								<div className="x_content">
									<table id="table-archetype-detail" className="table table-condensed table-striped">
										<tbody>
											<tr>
												<td>ID</td>
												<td>{this.state.instance._id}</td>
											</tr>
											<tr>
												<td>State</td>
												<td>{this.state.instance.state}</td>
											</tr>
											<tr>
												<td>Created On</td>
												<td>{this.state.instance.createdTs}</td>
											</tr>
											<tr>
												<td>Created By</td>
												<td>{this.state.instance.createdBy}</td>
											</tr>
											<tr>
												<td>Activated On</td>
												<td>{this.state.instance.activatedTs}</td>
											</tr>
											<tr>
												<td>Invalidated On</td>
												<td>{this.state.instance.deactivatedTs}</td>
											</tr>
											<tr>
												<td>Invalidated By</td>
												<td>{this.state.instance.deactivatedBy}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className="col-md-4 col-sm-6 col-xs-12">
							<div className="x_panel">
								<div className="x_content">
									<h4>Associated License Archetype Details</h4>
									<br />
								</div>
								<div className="x_content">
									<table id="table-archetype-detail" className="table table-condensed table-striped">
										<tbody>
											<tr>
												<td>ID</td>
												<td>{this.state.template._id}</td>
											</tr>
											<tr>
												<td>Name</td>
												<td>{this.state.template.name}</td>
											</tr>
											<tr>
												<td>Max honthly hours</td>
												<td>{this.state.template.maxHours}</td>
											</tr>
											<tr>
												<td>Max concurrency</td>
												<td>{this.state.template.maxConcurrency}</td>
											</tr>
											<tr>
												<td>Max attendees</td>
												<td>{this.state.template.maxAttendees}</td>
											</tr>
											<tr>
												<td>License Duration (Days)</td>
												<td>{this.state.template.licenseDuration}</td>
											</tr>
											<tr>
												<td>Created By</td>
												<td>{this.state.template.createdBy}</td>
											</tr>
											<tr>
												<td>Created Timestamp</td>
												<td>{this.state.template.createdTs}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className="col-md-4 col-sm-6 col-xs-12">
							<div className="x_panel">
								<div className="x_content">
									<h4>Associated Organisation Details</h4>
									<br />
								</div>
								<div className="x_content">
									<table id="table-archetype-detail" className="table table-condensed table-striped">
										<tbody>
											<tr>
												<td>ID</td>
												<td>{this.state.org._id}</td>
											</tr>
											<tr>
												<td>Abbreviation</td>
												<td>{this.state.org.abbrev}</td>
											</tr>
											<tr>
												<td>Name</td>
												<td>{this.state.org.name}</td>
											</tr>
											<tr>
												<td>Email</td>
												<td>{this.state.org.email}</td>
											</tr>
											<tr>
												<td>Description</td>
												<td>{this.state.org.maxConcurrency}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LicenseInstanceDetail;
