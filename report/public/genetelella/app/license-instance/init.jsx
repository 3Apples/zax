import $                  from 'jquery';
import bootstrap          from '../../vendors/bootstrap/dist/js/bootstrap.min';
import custom             from '../../build/js/custom.js';
import domready           from '../domReady';
import React              from 'react';
import { render }         from 'react-dom';
import { BrowserRouter }  from 'react-router-dom';
import App                from './app.jsx';
import 'react-table/react-table.css';

domready (function () {
	render(
		<BrowserRouter>
			<App />
		</BrowserRouter>,
		document.getElementById('main')
	);

});
