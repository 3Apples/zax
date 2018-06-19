import {$,jQuery}  from 'jquery';
import React       from 'react';
import {Link}      from 'react-router-dom';
import ReactTable  from 'react-table';
import DateRangePicker from 'react-daterange-picker';
import 'react-daterange-picker/dist/css/react-calendar.css';
import moment from 'moment';
import 'moment-range';

const stateDefinitions = {
	available: {
		color: null,
		label: 'Available',
	},
	unavailable: {
		selectable: false,
		color: '#78818b',
		label: 'Unavailable',
	},
};

const dateRanges = [
	{
		state: 'unavailable',
		range: moment.range(
			new Date ('January 1, 1970 00:00:00'),
			moment().subtract(8, 'weeks')
		),
	},
];

class DateRangeWidget extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: null,
		};

		this.handleSelect = this.handleSelect.bind(this);
	}

	getInitialState() {
		return {
			value: null,
		};
	}

	handleSelect(range, states) {
		this.setState({
			value: range,
			states: states,
		});

		this.props.onSelect (range );
	}

	render() {
		if (!this.props.onSelect)
			throw 'need onSelect property to be set';

		return (
			<DateRangePicker
				firstOfWeek={1}
				numberOfCalendars={2}
				selectionType='range'
				minimumDate={ new Date ( moment().subtract(1, 'years')) }
				stateDefinitions={stateDefinitions}
				dateStates={dateRanges}
				defaultState="available"
				showLegend={true}
				value={this.state.value}
				onSelect={this.handleSelect} />
		);
	}
}

export default DateRangeWidget;
