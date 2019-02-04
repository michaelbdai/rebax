import {
  Store,
  createStateProvider,
  createStateConsumer,
} from './stateManager';

import { CHANGE_CURRENT } from './actions';

const initialState = {
  currentNumber: 0
};

export const reducer = (state = initialState, action) => {
  switch(action.type) {
    case CHANGE_CURRENT:
      return {
        ...state, currentNumber: action.newNumber
      };
    default:
      return state;
  }
}

export const store = new Store();
export const ContextConsumer = store.StateContext.Consumer;
export const stateProvider = createStateProvider(store, reducer);
export const stateConsumer = createStateConsumer(store);
