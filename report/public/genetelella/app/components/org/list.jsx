import {$,jQuery}  from 'jquery';
window.$ = $;
window.jQuery = jQuery;

import React       from 'react';
import {Link}      from 'react-router-dom';
import moment      from 'moment';
import ReactTable  from 'react-table';
import xhr         from '../../common/xhr';
import '../../less/table.less';

class OrgList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			loadRender: false,
			items: []
		};

		this.updateList = this.updateList.bind(this);
	}

	componentDidMount () {
		this.updateList ();
	}

	updateList () {
		xhr.get ("/vc-admin/org/list")
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
		const cols = [
			{ Header : 'Name', accessor : 'name', Cell : (row) => (<Link to={`/vc-admin/org/page/detail/${row.original._id}`} > {row.value} </Link>) },
			{ Header : 'Email', accessor : 'email' },
			{ Header : 'Created by', id : 'AddedBy', accessor : d => d.createdBy.replace(/:/g, '/') },
			{ Header : 'Created on', id : 'AddedOn', accessor : d => moment(d.createdTs).format('DD MMM YYYY') },
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

export default OrgList;
