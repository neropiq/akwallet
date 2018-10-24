import { Store, createStore, compose } from 'redux';
import { state, State } from '../reducers';

export const store: Store<State> = createStore(state, 
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);