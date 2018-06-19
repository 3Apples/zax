import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import ReactTable  from 'react-table';
import {Link}      from 'react-router-dom';
import xhr         from '../../common/xhr';
import Resolve     from '../misc/resolve.jsx';
import '../../less/table.less';

class RolesList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			loadRender: false,
			items: []
		};

		this.orgMap = {};
		this.orgList = [];

		this.update_list = this.update_list.bind(this);
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

	update_list () {
		var _this = this;

		xhr.get ("/vc-admin/roles/list")
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

	render() {

		const cols = [
			{ Header : '', id : 'select', Cell: <input type="checkbox" />, width : 30 },
			{ Header : 'Name',
				Cell : (row) => (<Link to={`/vc-admin/roles/detail/page/${row.original._id}`} > {row.original.name} </Link>)
			},
			{ Header : 'Added by', id : 'AddedBy', 
				Cell : (row) => ( <Resolve
								 	Id={row.original.createdBy} 
									profile='User'
									/>
								)
			},
			{ Header : 'Added on', id : 'AddedOn', accessor : d => moment(d.createdTs).format('DD MMM YYYY hh:mm a') },
		];

		return (
			<ReactTable
				minRows={1}
				data={this.state.items}
				columns={cols}
				style={{
					width : '100%',
				}}
			/>
		);
	}
}

export default RolesList;
