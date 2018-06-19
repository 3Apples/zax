import {$,jQuery}         from 'jquery';
import moment             from 'moment';
import React              from 'react';
import ReactTable         from 'react-table';
import {Link}             from 'react-router-dom';
import xhr                from '../common/xhr';
import listStore          from '../components/class/store';
import Resolve            from '../components/misc/resolve.jsx';
import { durationPretty } from '../common/time';
import { defaultSort }    from '../components/misc/sort.jsx';
import '../less/table.less';
import './table.less';

function make_query (range, filters) {
	var first = true;
	var options = {
		sf : range && range.start && range.start.startOf('day').utc().toISOString(),
		st : range && range.end   &&   range.end.endOf('day').utc().toISOString(),
	};

	var obj = {};
	obj.filters = filters;
	Object.assign(options, obj);

	var query = Object.keys(options || {}).reduce (function (acc, curr, index) {
		if (!options[curr])
			return acc;

		if (first)
			acc += '?';
		else
			acc += '&';

		first = false;

		/*
		 * build query string for array */
		if (options [curr] instanceof Array) {
			for (var i=0; i< options [curr].length; i++) {
				acc += encodeURI(curr + '[]=' + options [curr] [i] + '&');
			}
			/*
			 * slice off the last extra & in accumulator */
			acc = acc.slice(0, -1);

			return acc;
		}

		return acc + encodeURI(curr + '=' + options [curr]);
	}, '');

	return query;
}

class Table extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error     : null,
			items     : [],
			server_ts : null,
		};

		this.rowCallback = this.rowCallback.bind(this);
	}

	componentDidMount () {
		this.refresh (null, this.props.filters);
	}

	human_time (time) {
		if (!this.state.server_ts)
			return moment(time).fromNow();

		var __server = moment (this.state.server_ts);
		var __time   = moment (time);

		return __time.from(__server);
	}

	refresh (range, filters) {
		var query = make_query (range, filters);

		xhr.get ("/vc-admin/class/list" + query)
			.then(
				(result) => {
					this.setState({
						items     : result.classes.classes,
						server_ts : result.classes.server_ts
					});

					listStore.set (result.classes.classes);
				},
				(error) => {
					this.setState({
						error:    error,
					});
				}
			);
	}

	rowCallback(state, rowInfo, column) {
		if (!rowInfo)
			return {};
		
		var styles = { className : '' };

		/*
		 * color code row
		 */
		var status = this.styleRemovedClass (rowInfo);
		styles.className += status;

		/*
		 * Animate a recent row
		 */
		var recentClass = this.styleRecentClass (rowInfo);
		if (recentClass)
			styles.className += (' ' + recentClass);

		return styles;
	}

	styleRemovedClass(rowInfo) {
		var status  = rowInfo.row.status;
		var removed = rowInfo.original.removed;

		status = removed ? 'removed' : status;

		return 'status-' + status;
	}

	styleRecentClass(rowInfo) {
		var creationTime = moment (rowInfo.row['meta_info.creation_ts']);
		var serverTs     = moment (this.state.server_ts);
		var duration     = moment.duration (serverTs.diff (creationTime)).asMinutes ();

		if (duration >= 0 && duration <= 2) {
			console.log({CreationTS : creationTime });
			console.log({serverTs : serverTs});
			return 'newly-created';
		}
	}

	render() {
		const cols = [
			{ 
				Header : 'Title', 
				accessor : 'meta_info.title', 
				Cell : (row) => (<Link to={`/vc-admin/class/detail-page/${row.original.class_id}`} > {row.value} </Link>)
			},
			{ 
				Header : 'Organization', 
				accessor : 'org_id', 
				Cell : (row) => (<Resolve
								 	Id={row.value} 
									profile='Org'
									/>
								),
				width : 200,
			},
			{ 
				Header : 'Creator', 
				accessor : 'meta_info.creator', 
				Cell : (row) => (<Resolve
								 	Id={row.value.id + ':' + row.value.auth_via} 
									profile='User'
									/>
								),
				width : 100,
			},
			{ 
				Header : 'Status', 
				accessor : 'status', 
				Cell : (row) => {
					var status = row.original.removed ? 'removed' : row.value;

					return (
						<div className="status">
							<span> {status} </span>
						</div>
					);
				}, 
				width:140
			},
			{ Header : 'Created', accessor : 'meta_info.creation_ts', Cell : (row) => { return moment(row.value).format('YYYY MMM DD hh:mm a') ; }, width : 160},
			{ 
				Header : 'Start Time', 
				id : 'start_time', 
				accessor : d => d.provisioning && d.provisioning.time_spec && d.provisioning.time_spec.actual_start_time || d.time_spec.starts,
				Cell : (row) => {
					var el = row.original;
					var _start_ts = row.value;
					return moment(_start_ts).format ('YYYY MMM DD hh:mm a');
				}, 
				width : 160
			},
			{ 
				Header : 'Duration', 
				accessor : 'time_spec.duration', 
				Cell : (row) => {
					if (row.value < 0)
						return 'perma';

					var duration = moment.duration (row.value, 'minutes');
					var d = duration.days();
					var h = duration.hours();
					var m = duration.minutes();

					return (
						<div>
						{ d > 0 && 
							<span>{d}<sub>d</sub></span>
						}
						{ h > 0 && 
							<span>{h}<sub>h</sub></span>
						}
						{ m > 0 && 
							<span>{m}<sub>m</sub></span>
						}
						</div>
					);
				}, 
				width:80
			},
		];

		return (
			<ReactTable
				minRows={1}
				defaultPageSize={20}
				data={this.state.items}
				columns={cols}
				defaultSorted={[ { id : 'start_time', desc : true }]}
				className='-striped -highlight'
				style={{
					width : '100%',
				}}
				getTrProps={this.rowCallback}
				defaultSortMethod={defaultSort}
			/>
		);
	}
}

export default Table;
