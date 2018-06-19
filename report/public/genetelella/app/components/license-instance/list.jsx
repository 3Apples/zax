import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import ReactTable  from 'react-table';
import { Link }    from 'react-router-dom';
import xhr         from '../../common/xhr';
import Resolve     from '../misc/resolve.jsx';
import '../../less/table.less';
import './tables.less';

class LicenseInstanceList extends React.Component {

	constructor (props) {
		super (props);
		this.state = {
			error: null,
			loadRender: false,
			items: []
		};

		this.orgMap = {};
		this.orgList = [];
		this.templateMap = {};
		this.templateList = [];

		this.invalidateBtn = React.createRef ();
		this.activateBtn   = React.createRef ();

		this.update_list   = this.update_list.bind (this);
		this.invalidate    = this.invalidate.bind (this);
		this.activate      = this.activate.bind (this);
		this.action        = this.action.bind (this);
	}

	componentDidMount () {
		this.update_list ();
	}

	createOrgMap () {
		if (!this.orgList)
			return;

		for (var i = 0; i < this.orgList.length; i++) {
			this.orgMap[this.orgList[i]._id] = this.orgList[i];
		}
	}

	createTemplateMap () {
		if (!this.templateList)
			return;

		for (var i = 0; i < this.templateList.length; i++) {
			this.templateMap[this.templateList[i]._id] = this.templateList[i];
		}
	}

	update_list () {
		xhr.get ("/vc-admin/lic/instance/list")
		.then(
			(result) => {
				this.setState ({
					loadRender: true,
					items: result
				});
			},
			(error) => {
				this.setState ({
					loadRender: true,
					error:    error,
				});
			}
		);
	}
	
	getOrgs () {
		var _this = this;

		xhr.get ("/vc-admin/org/list")
		.then(
			(result) => {
				this.orgList = result;
				this.createOrgMap ();
				var _items = _this.state.items;

				for (var i = 0; i < _items.length; i++) {
					var orgId = _items[i].orgId;
					_items[i].org = this.orgMap [orgId] || { name : '-not-set-' };
				}

				_this.setState({ items: _items });
			},
			(error) => {
				_this.setState({
					loadRender: true,
					error:    error,
				});
			}
		);
	}

	geTemplates () {
		var _this = this;

		xhr.get ("/vc-admin/lic/template/list")
		.then(
			(result) => {
				this.templateList = result;
				this.createTemplateMap ();
				var _items = _this.state.items;

				for (var i = 0; i < _items.length; i++) {
					var templateId = _items[i].templateId;
					_items[i].template = this.templateMap [templateId] || { name : '-not-set-' };
				}

				_this.setState({ items: _items });
			},
			(error) => {
				_this.setState({
					loadRender: true,
					error:    error,
				});
			}
		);
	}

	activate (id) {
		if (confirm ("Are you sure to activate?") !== true) return;
		xhr.put ('/vc-admin/lic/instance/activate', { id : id })
			.then (() => {
				this.update_list ();
				if (this.props.callback)
					return this.props.callback (null, this.state);
				}
			)
			.fail ( (err) => {
				console.error ('error :' + err);
				alert('Error, Try again.');
			});
		
	}

	invalidate (id) {
		if (confirm ("Are you sure to invalidate?") !== true) return;
		xhr.put ('/vc-admin/lic/instance/invalidate', { id : id })
			.then ( () => {
				this.update_list ();
				if (this.props.callback)
					return this.props.callback (null, this.state);
				}
			)
			.fail ((err) => {
				console.error ('error :' + err);
				alert('Error, Try again.');
			});
	}

	test (data) {
		return (<button type="button" className="btn btn-primary" >Activate</button>)
	}

	action (data) {
		var state = data.state;
		var id    = data._id;
		switch (state) {
			case 'activated' : return (
				<a href="javascript:void(0)" onClick={this.invalidate.bind (null, id)}>
					<span> Retire </span>
				</a>
			);
			case 'created' : return ( 
				<a href="javascript:void(0)" onClick={this.activate.bind (null, id)}>
					<span> Activate </span>
				</a>
			);
			default : return;
		}
	}

	colorCodeRow (state, rowInfo, column) {
		if (!rowInfo)
			return {};

		return {
			className : 'state-' + rowInfo.row.state
		};
	}

	render() {
		const cols = [
			{ Header : '', id : 'select', Cell: <input type="checkbox" />, width : 30 },
			{ Header : 'Id',   accessor : '_id',
				Cell: row => (
					<Link to={ `/vc-admin/lic/instance/detail/page/${row.original._id}`}>
						{ row.value }
					</Link> 
					
				) },
			{ Header : 'Organization', id : 'org', 
				Cell : (row) => {
							return (<Resolve
								 	Id={row.original.orgId}
									profile='Org'
								/>);
				},
			},
			{ Header : 'Archetype', id : 'archetype', 
				Cell : (row) => {
							return (<Resolve
								 	Id={row.original.masterId}
									profile='Template'
								/>);
				},
			},
			{ 
				Header : 'State',
				accessor : 'state',
				Cell : (row) => {
					var classes = 'state state-' + row.value;
					var display = '';

					switch (row.value) {
						case 'created':
							display = 'UN-ASSIGNED';
							break;

						case 'activated':
							display = 'ACTIVE';
							break;

						case 'deactivated':
							display = 'RETIRED';
							break;

						default :
							display = row.value;
							break;
					}

					return (
						<div className={classes}>
							<span> {display} </span>
						</div>
					);
				}, 
				width : 140,
			},
			{ Header : 'Created on', id : 'createdOn', accessor : d => momentFormat(d.createdTs) },
			{ Header : 'Deactivated on', id : 'deactivatedOn', accessor : d => momentFormat(d.deactivatedTs) },
			{ Header : 'Actions', id : 'actions', Cell : d => this.action (d.original), width : 100},
		];

		return (
			<ReactTable
				minRows={1}
				data={this.state.items}
				columns={cols}
				style={{
					width : '100%',
				}}
				getTrProps={this.colorCodeRow}
			/>
		);
	}
}

var momentFormat = function(arg){
	if (typeof(arg) == "undefined"){
		return '-';
	}
	return moment(arg).format( 'YYYY MMM DD hh:mm a' );
}

export default LicenseInstanceList;
