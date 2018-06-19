import React                             from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import xhr                               from '../common/xhr';
import identity                          from '../common/identity';
import UserWidget                        from './userWidget.jsx';
import OrgWidget                         from './orgWidget.jsx';
import StatWidget                        from './statWidget.jsx';
import Calender                          from './calender.jsx';
import UserListWidget                    from './userListWidget.jsx';
import LicenseWidget                     from './licenseWidget.jsx';
//import LegendCard                      from './legendCard.jsx';

import './dash.less';

class Main extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			redirect        : false,
			redirectTo      : null,
			classStats      : { completed : '-', running : '-', scheduled : '-', unhandled : '-' },
			activeUserStat  : '-',
			userList        : null,
			error           : null,
		};
		this.setRedirect      = this.setRedirect.bind(this);
	}
	
	componentDidMount () {
		this.getClassStats ();
		this.getUserList ();
	}
	
	setRedirect (event) {
		let url = event.target.dataset.url;
		this.setState ({
			redirect : false,
			redirectTo : url,
		});
		window.location = url;
	}

	getClassStats () {
		xhr.get ("/vc-admin/class/list")
			.then (
				(result) => {
					console.log ({ classList : result }, 'Class List');
					this.calculateStats (result.classes);
				},
				(error) => {
					this.setState ({
						error : error,
					});
				}
			);


	}
	
	calculateStats (classList) {
		let stats = { completed : 0, running : 0, scheduled : 0, unhandled : 0 };
		for ( let i = 0; i < classList.length; i ++) {
			switch (classList[i].status) {
				case 'completed' : {
					stats.completed += 1;
					break;
				}
				case 'running' : {
					stats.running += 1;
					break;
				}
				case 'scheduled' : {
					stats.scheduled += 1;
					break;
				}
				default : {
					stats.unhandled += 1;
				} 
			}	
		}
		console.log ({ classStats : stats }, 'Class Stats');
		this.setState ({
			classStats : stats,
		});
	}

	getUserList () {
		xhr.get ("/vc-admin/user/list")
		.then(
			(result) => {
				console.log ({ userList : result }, 'User List');
				this.setState({
					loadRender     : true,
					userList       : result,
					activeUserStat : result.length,
				});
				console.log ({ userStat : this.state.activeUserStat }, 'Active User Stat');
			},
			(error) => {
				this.setState({
					loadRender : true,
					error      : error,
				});
			}
		);
	}

	createColorStyle (color) {
		var style = {
			backgroundColor : color,
		};
		return style;
	}
	
	render () {
		const statWidget1 = {
				title      : 'Active Users',
				desc       : 'Lorem ipsum psdea itgum rixt.',
				count      : this.state.activeUserStat,
				iconClass  : 'fa-users',
		};
		const statWidget2 = {
				title      : 'Scheduled Classes',
				desc       : 'Lorem ipsum psdea itgum rixt.',
				count      : this.state.classStats.scheduled,
				iconClass  : 'fa-calendar',
		};
		const statWidget3 = {
				title      : 'Running Classes',
				desc       : 'Lorem ipsum psdea itgum rixt.',
				count      : this.state.classStats.running,
				iconClass  : 'fa-book',
		};
		const statWidget4 = {
				title      : 'Completed Classes',
				desc       : 'Lorem ipsum psdea itgum rixt.',
				count      : this.state.classStats.completed,
				iconClass  : 'fa-archive',
		};
		const userListWidget = {
				heading    : 'Members',
				userList   : this.state.userList || [],	
		};
		const legendVars = [
				{ label : 'running',   color : '#1ABB9C'},
				{ label : 'completed', color : '#88a0b9'},
				{ label : 'scheduled', color : '#3498DB'},
				{ label : 'deleted',   color : '#F39C12'},
				{ label : 'failed',    color : '#E74C3C'},
		];
		if (this.state.redirect) {
			return (
				pug `
					Redirect(to=this.state.redirectTo)
				`
			);
		}

		return (
			pug`
				.row
					.col-md-12.col-sm-12.col-xs-12
						.row
							.col-md-3.col-sm-6.col-xs-12
								StatWidget(options=statWidget1)
							.col-md-3.col-sm-6.col-xs-12
								StatWidget(options=statWidget2)
							.col-md-3.col-sm-6.col-xs-12
								StatWidget(options=statWidget3)
							.col-md-3.col-sm-6.col-xs-12
								StatWidget(options=statWidget4)
						.row
							.col-md-12.col-sm-12.col-xs-12
									.x_panel
										.x_title
											h2
												| Presentations Calendar 
											.clearfix
										.x_content.row
											.col-md-9.col-sm-9.col-xs-12
												Calender
											.col-md-3.col-sm-3.col-xs-12
												.x_title
													h4 Legend
													.clearfix
												.x_content
													.cal-legend
														each legend, index in legendVars
															div(key=index)
																span.color(style=this.createColorStyle(legend.color))
																span #{legend.label}
						.row
							.col-md-9.col-sm-9.col-xs-12
								.row
									.col-md-12.col-sm-12.col-xs-12
										.x_panel
											.x_title
												h3 Quick Links
												.clearfix
											.x_content
												.buttons
													button.btn.btn-info.btn-lg(type='button' data-url='/vc-admin/user/add/page' onClick=this.setRedirect) Add User
													button.btn.btn-info.btn-lg(type='button' data-url='/vc-admin/class/create-page' onClick=this.setRedirect) Create Class
													button.btn.btn-info.btn-lg(type='button' data-url='/vc-admin/' onClick=this.setRedirect) List Users
													button.btn.btn-info.btn-lg(type='button' data-url='/vc-admin/user/' onClick=this.setRedirect) List Classes
								.row
									.col-md-4.col-sm-4.col-xs-12
										UserWidget
									.col-md-4.col-sm-4.col-xs-12
										OrgWidget
									.col-md-4.col-sm-4.col-xs-12
										LicenseWidget
							.col-md-3.col-sm-3.col-xs-12
								UserListWidget(options=userListWidget)

				`);
	}
}

var App = () => (
	<main>
		<Switch>
			<Route exact path='/vc-admin/dash' component={Main}/>
		</Switch>
	</main>
);

export default App;

