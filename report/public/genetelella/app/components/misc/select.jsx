import React       from 'react';
import xhr         from '../../common/xhr';
import Select      from 'react-select';

import 'react-select/dist/react-select.css';

class OrgSelect extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error           : null,
			list            : null,
			selected        : props.isMulti ? [] : null,
		};

		this.onChange = this.onChange.bind(this);
	}

	componentWillMount () {
		if (!this.props.url)
			throw 'url needed';
		if (!this.props.mapper)
			throw 'mapper function needed';
		if (!this.props.onChange)
			throw 'onChange needed';
	}

	componentDidMount () {
		var _this = this;

		this.setState ({ selected : this.props.value }, () => {
			xhr.get (this.props.url)
				.then (
					(list) => {
						var newList = list.map (this.props.mapper);

						_this.setState({ list : newList });
					},
					(err) => {
						_this.setState ({ error : err });
					}
				);
		});
	}

	onChange (ev) {
		if (!ev)
			ev = {};

		var selected = ev;

		this.setState ({ selected : selected }, function () {
			if (this.props.isMulti)
				this.props.onChange ({ values : selected, key : this.props._key });
			else
				this.props.onChange ({ value : selected, key : this.props._key });
		});
	}

	render () {
		var props = {
			value         : this.props.value,
			options       : this.state.list || [],
			placeHolder   : this.props.placeholder || '-no-placeholder-',
			onChange      : this.onChange,
			multi         : this.props.isMulti || null,
			joinValues    : this.props.isMulti || null,
			className     : 'basic-multi-select',
			defaultValue  : this.props.defaultValue || [],
			disabled      : this.props.disabled,
		};


		return (
			<Select {...props} />
		);
	}
}

export default OrgSelect;
