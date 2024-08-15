import configureStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
import { initialState } from './initState';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
export const mockStoreWithState = configureStore(middlewares);
export const mockStore = () => mockStoreWithState(initialState);
