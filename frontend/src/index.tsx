import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { store } from './store';

import { Provider } from 'react-redux';
import { BrowserRouter,  Route , Switch } from 'react-router-dom';
import AdminPanel from './components/adminPanel/adminpanel';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter >
        <div>
            <Switch>
                <Route path='/' component={AdminPanel} />                         
            </Switch>
        </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app') as HTMLElement
);
