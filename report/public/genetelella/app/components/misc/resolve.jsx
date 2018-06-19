import $           from 'jquery';
import React       from 'react';
import xhr         from '../../common/xhr';

var map = {};

function get (Id, resolveUrl) {
	var key = Id + resolveUrl;
	var d   = $.Deferred ();

	if (!map[key]) {
		map[key] = {
			Id         : Id,
			resolveUrl : resolveUrl,
			arr_d      : [ ],
			detail     : null,
			err        : null,
			resolved   : false,
		};

		xhr.get (resolveUrl.replace(/:Id/, Id))
			.then (
				(detail) => {
					map[key].resolved = true;
					map[key].detail = detail;
					map[key].arr_d.forEach((curr) => curr.resolve (detail));
				},
				(err) => {
					map[key].resolved = true;
					map[key].err = err;
					map[key].arr_d.forEach((curr) => curr.reject (err));
				}
			);

		map[key].arr_d.push (d);
	}
	else if (map[key] && map[key].resolved) {
		if (map[key].detail)
			d.resolve (map[key].detail);
		else
			d.reject (map[key].err);
	}
	else
		map[key].arr_d.push (d);

	return d.promise ();
}
const Profile = {
	'User' : {
		resolveUrl    : '/vc-admin/user/detail/:Id',
		detailPageUrl : '/vc-admin/user/detail/page/:Id',
		mapper        : (d) => d.firstName + ' ' + d.lastName,
	},
	'Org' : {
		resolveUrl    : '/vc-admin/org/detail/:Id',
		detailPageUrl : '/vc-admin/org/page/detail/:Id',
		mapper        : (d) => d.name,
	},
	'Template' : {
		resolveUrl    : '/vc-admin/lic/template/get/:Id',
		detailPageUrl : '/vc-admin/lic/template/detail/page/:Id',
		mapper        : (d) => d.name,
	},
	'Role' : {
		resolveUrl    : '/vc-admin/roles/detail/:Id',
		detailPageUrl : '/vc-admin/roles/detail/page/:Id',
		mapper        : (d) => d.name,
	},
};

class ResolveUser extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			name : props.Id,
			_status : 'init',
		};
	}

	componentWillMount () {
		if (!Profile[ this.props.profile ])
			throw 'profile needed';
	}

	componentDidMount () {
		var _this      = this;
		var resolveUrl = Profile[this.props.profile].resolveUrl;
		var mapper     = Profile[this.props.profile].mapper;

		if (!this.props.Id)
			return this.setState({ name : 'no data', error : true });

		this.setState ({ name : this.props.Id, error : null, _status : 'resolving' }, () => {
			get (this.props.Id, resolveUrl.replace(/:Id/g, this.props.Id))
				.then (
					(detail) => {
						var new_name = mapper (detail);
						_this.setState ({ name : new_name, _status : 'done', error : null });
					},
					(err) => {
						_this.setState ({ error : err, _status : 'done' });
					}
				);
		});
	}

	componentDidUpdate (prevProps, prevState) {
		var _this      = this;
		var resolveUrl = Profile[this.props.profile].resolveUrl;
		var mapper     = Profile[this.props.profile].mapper;

		if (prevProps.Id == this.props.Id)
			return;

		if (!this.props.Id)
			return this.setState({ name : 'no data', error : true });

		this.setState ({ name : this.props.Id, error : null, _status : 'resolving' }, () => {
			get (this.props.Id, resolveUrl.replace(/:Id/g, this.props.Id))
				.then (
					(detail) => {
						var new_name = mapper (detail);
						_this.setState ({ name : new_name, _status : 'done' });
					},
					(err) => {
						_this.setState ({ error : err, _status : 'done' });
					}
				);
		});
	}

	render () {
		var profile       = this.props.profile;
		var resolveUrl    = Profile[profile].resolveUrl;
		var detailPageUrl = Profile[profile].detailPageUrl;

		return (
			<span className="resolver"> 

				{ this.state._status === 'resolving' && 
					<span className="fa fa-spinner fa-spin"> </span>
				}

				{ (this.props.noHyperLink || this.state.error) && 
					<span> { this.state.name } </span>
				}

				{ (!this.props.noHyperLink && !this.state.error) &&
					<a href={ detailPageUrl.replace (/:Id/g, this.props.Id) } > { this.state.name } </a>
				}

				{ this.state.error &&
					<sup className="fa fa-exclamation text-danger"> </sup>
				}

			</span>
		);
	}
}

export default ResolveUser;
