import moment from 'moment'

export function durationPretty (__duration, opts) {

	if (__duration == -1)
		return 'perma';

	var duration = moment.duration (__duration, 'minutes');
	var d = duration.days();
	var h = duration.hours();
	var m = duration.minutes();
	var str = '';

	if (d)
		str += d + 'd ';

	if (opts && opts.verbose) {
		h += opts.abbrev ? 'h' : ' hours';
		str += ' ' + h;
	}
	else {
		if (h < 9) h = '0' + h;
		str += h + ':';
	}


	if (opts && opts.verbose) {
		m += opts.abbrev ? 'm' : ' minutes';
	}
	else
		if (m < 9) m = '0' + m;

	str += ' ' + m;

	return str.trim();
}
