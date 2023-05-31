import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import themeReducer from './theme/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  theme: themeReducer,
});

export default rootReducers;
