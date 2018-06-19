import $           from 'jquery';
import moment      from 'moment';
import React       from 'react';
import ReactTable  from 'react-table';
import { Link }    from 'react-router-dom';
import xhr         from '../../common/xhr';

class LicenseTemplateList extends React.Component {

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
		this.update_list ();
	}

	update_list () {
		xhr.get ("/vc-admin/lic/template/list")
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
			{ Header : '', id : 'select', Cell: <input type="checkbox" />, width : 30 },
			{ Header : 'Name', accessor : 'name' },
			{ Header : 'Id',   accessor : '_id',
				Cell: row => (
					<Link to={ `/vc-admin/lic/template/detail/page/${row.value}`} style={{'textDecoration':'underline'}}>
						{ row.value }
					</Link>
				) },
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

export default LicenseTemplateList;
