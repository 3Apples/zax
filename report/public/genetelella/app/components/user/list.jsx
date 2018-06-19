import $                from 'jquery';
import moment           from 'moment';
import React            from 'react';
import ReactTable       from 'react-table';
import {Link}           from 'react-router-dom';
import xhr              from '../../common/xhr';
import Resolve          from '../misc/resolve.jsx';
import { defaultSort }  from '../misc/sort.jsx';

class UserList extends React.Component {

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

		xhr.get ("/vc-admin/user/list")
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
			{ Header : 'Name', id : 'fullName', accessor : d => d.firstName + ' ' + d.lastName,
				Cell : (row) => { 
					var name = row.original.firstName + ' ' + row.original.lastName;
					var id   = row.original.id.split(':')[0];

					return (
						<Link
							to={`/vc-admin/user/detail/page/${id}`} > 
							{name}
						</Link>
					);
				},
				sortMethod: (a, b) => {
							var _a = a && a.toLowerCase ();
							var _b = b && b.toLowerCase ();

							if (_a < _b)
								return -1;

							if (_a > _b)
								return 1;

							return 0;
				}
			},
			{ Header : 'Organization', id : 'org', accessor:'orgId',
				Cell : (row) => {
							return (<Resolve
								 	Id={row.original.orgId}
									profile='Org'
								/>);
				},
			},
			{ Header : 'Id',   id : 'ID', accessor : d => d.id.split(':')[0] },
			{ Header : 'Email', accessor : 'email' },
			{ Header : 'Role', id : 'role', 
				Cell : (row) => {
					var admin3a = this.props.self.permFlags && this.props.self.permFlags.admin3a || false;

					return (<Resolve
							Id={row.original.roleId}
							profile='Role'
							noHyperLink={!admin3a}
						/>);
				},
			},
			{ Header : 'Added on', id : 'AddedOn', accessor : d => moment(d.createdTs).format('DD MMM YYYY hh:mm a') },
		];

		return (
			<ReactTable
				minRows={1}
				data={this.state.items}
				columns={cols}
				defaultSorted={[ { id : 'fullName', desc : false }]}
				style={{
					width : '100%',
				}}
				defaultSortMethod={defaultSort}
			/>
		);
	}
}

export default UserList;
