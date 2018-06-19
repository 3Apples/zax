import {$,jQuery} from 'jquery';
window.$ = $;
window.jQuery = jQuery;

import bootstrap          from '../../vendors/bootstrap/dist/js/bootstrap.min'
import custom             from '../../build/js/custom.js'
import domready           from '../domReady';
import React              from 'react';
import { render }         from 'react-dom';
import { BrowserRouter }  from 'react-router-dom';
import { Breadcrumb }     from 'react-breadcrumbs';
import { Route, Switch }  from 'react-router-dom';
import App                from './app.jsx';
import 'react-table/react-table.css'


	domready (function () {
		render(
			<BrowserRouter>
				<Route path='/vc-admin/org/' render={ () =>
					<Breadcrumb data={{
							title    : 'Organisation',
							pathname : '/vc-admin/org/'
						}}>
						<App />
					</Breadcrumb>
				} />
		</BrowserRouter>,
			document.getElementById('main')
		);

	});
