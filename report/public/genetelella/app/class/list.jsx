import {$,jQuery}      from 'jquery';
import React           from 'react';
import {Link}          from 'react-router-dom';
import Select          from 'react-select';
import DateRangeWidget from './date-range.jsx';
import Table           from './table.jsx';
import xhr             from '../common/xhr';

import './list.less';

class ClassListApp extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dateRange     : null,
			statusFilters : ['running', 'scheduled', 'failed']
		};

		this.onDateSelected  = this.onDateSelected.bind(this);
		this.onStatusFilters = this.onStatusFilters.bind(this);

		this.refTable = React.createRef();
	}

	onDateSelected (range) {
		this.refTable.current.refresh (range, this.state.statusFilters);
	}

	onStatusFilters (event) {
		var filters = Array.from(event.values(), curr => curr.value);

		this.setState ({ statusFilters : filters }, () => {
			this.refTable.current.refresh (this.state.dateRange, this.state.statusFilters);
		});
	}

	render() {
		return ( pug`
				.x_title
					h2 Presentations List
					ul(class='nav navbar-right panel_toolbox')
						li
							a(data-toggle='collapse' href='#class-filters')
								i(class='fa fa-cog')
					.clearfix
				div(id='class-filters' class='panel-collapse collapse')
					DateRangeWidget(onSelect=${this.onDateSelected})
					Select(
						name      = 'status-filter'
						className = 'status-filter'
						value     = ${this.state.statusFilters}
						multi     = ${true}
						onChange  = ${this.onStatusFilters}
						options   = [
							{ value : 'running', label : 'Running' },
							{ value : 'scheduled', label : 'Scheduled' },
							{ value : 'failed', label : 'Failed' },
							{ value : 'completed', label : 'Completed' },
							{ value : 'removed', label : 'Removed' },
							{ value : 'stopped', label : 'Stopped' }
						]
					)
				Table(ref=${this.refTable} filters=this.state.statusFilters)
				`
		);
	}
}

export default ClassListApp;
