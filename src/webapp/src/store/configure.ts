import { clickableCellReducer, gridReducer, gridStore, imageViewerReducer } from '@oplog/data-grid';
import { createFileUploadsStore, fileUploadsReducer } from '@oplog/file-uploader';
import { resourceReducer, resourceStore } from '@oplog/resource-redux';
import { intlReducer } from 'react-intl-redux';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { config } from '../config';
import { StoreState } from '../store/initState';
import { getGridData, resourceApiMap, uploadImage } from '../services/api';
import { initialState } from './initState';

export function rootReducer(state: StoreState, action: any) {
  return {
    resources: resourceReducer(state.resources, action),
    grid: gridReducer(state.grid, action),
    imageViewer: imageViewerReducer(state.imageViewer, action),
    clickableCell: clickableCellReducer(state.clickableCell, action),
    intl: intlReducer(state.intl, action),
    files: fileUploadsReducer(state.files, action),
  };
}

export const resourceSaga = resourceStore({
  httpRequestMap: resourceApiMap,
});

export const fileUploadsStore = createFileUploadsStore({
  uploadFile: uploadImage,
});

export function initStore(): Store<StoreState> {
  const sagaMiddleware = createSagaMiddleware();

  const middleware = applyMiddleware(sagaMiddleware);

  let middlewares;

  if (!config.isTest && !config.isProduction && window['__REDUX_DEVTOOLS_EXTENSION__']) {
    middlewares = compose(middleware, window['__REDUX_DEVTOOLS_EXTENSION__']());
  } else {
    middlewares = compose(middleware);
  }

  const store = createStore<StoreState, any, any, any>(rootReducer, initialState, middlewares);

  sagaMiddleware.run(gridStore({ getGridData } as any).saga);
  sagaMiddleware.run(resourceSaga.resourceSaga);
  sagaMiddleware.run(fileUploadsStore.fileUploadsSaga);

  return store;
}
