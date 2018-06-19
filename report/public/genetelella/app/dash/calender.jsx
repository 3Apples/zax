import React        from 'react';
import xhr                     from '../common/xhr';
import moment             from 'moment';
import FullCalendar from 'fullcalendar-reactwrapper';


class Calender extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			classList : null,
			events:[
				{
					title: 'All Day Event',
					start: '2017-05-01'
				},
				{
					title: 'Long Event',
					start: '2017-05-07',
					end: '2017-05-10'
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2017-05-09T16:00:00'
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2017-05-16T16:00:00'
				},
				{
					title: 'Conference',
					start: '2017-05-11',
					end: '2017-05-13'
				},
				{
					title: 'Meeting',
					start: '2017-05-12T10:30:00',
					end: '2017-05-12T12:30:00'
				},
				{
					title: 'Birthday Party',
					start: '2017-05-13T07:00:00'
				},
				{
					title: 'Click for Google',
					url: 'http://google.com/',
					start: '2017-05-28'
				}
			],		
		};
	}

	componentDidMount () {
		this.getClassList ();
	}

	getClassList () {
		xhr.get ("/vc-admin/class/list")
			.then (
				(result) => {
					console.log ({ classList : result }, 'Class List');
					this.setState ({
						classList : result.classes,
					});
					this.generateEvents();
				},
				(error) => {
					this.setState ({
						error : error,
					});
				}
			);
	}

	generateEvents () {
		var events = [];
		var list = this.state.classList;
		for (let i = 0; i < list.length; i ++) {
			var event = {};
			var item = list[i];
			event.title = item.meta_info.title;
			event.start = moment (item.time_spec.starts);
			event.color = this.setColor (item.status);
			event.url   = '/vc-admin/class/detail-page/' + item.class_id;
			event.description = item.meta_info.description;
			events.push(event);
		}
		console.log({events : events, list : list}, 'Calender Events and Class List');
		this.setState ({
			events : events,
		});
	}
	
	setColor (status) {
		switch (status) {
			case 'failed'    : return '#E74C3C';
			case 'running'   : return '#1ABB9C';
			case 'completed' : return '#88a0b9';
			case 'scheduled' : return '#3498DB';
			case 'deleted'   : return '#F39C12';
			default          : return '#000000';
		}
	}

	render() {
		return (
			<div id="calender-widget">
				<FullCalendar
					id = "presentation-calender"
					header = {{
						left: 'prev,next today myCustomButton',
						center: 'title',
						right: 'month,basicWeek,basicDay'
					}}
					navLinks= {true} // can click day/week names to navigate views
					editable= {true}
					eventLimit= {true} // allow "more" link when too many events
					events = {this.state.events}
				/>
			</div>
		);
	}
}
export default Calender;

