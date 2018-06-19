class Store {

	constructor () {
		this.data = null;
	}

	map;

	set(data) { this.data = data; }
	getClass(class_id) { return this.data.find ((el) => { return el.class_id == class_id ? el : null }) };
}

var Instance = new Store();

export default Instance;
