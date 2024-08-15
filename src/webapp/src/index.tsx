import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './i18n';
import { register } from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);

register();
