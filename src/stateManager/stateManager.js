import React, { Component } from 'react';

import { LOCAL_REDO, LOCAL_UNDO, fetchSuccess, fetchFailure } from './actions';
import { requestSuccessAction, requestFailureAction, STATUS } from './actions';


/**
 * handles sideeffect
 * @param {Object} action same as Redux action
 * which requres state change during request pending
 * @param {function} dispatch same as Redux dispatch
 * @param {Promise|Async function} action.asyncAction promise which triggers server request(s)
 * @param {array} action.args array of the arg(s) which are for calling the action.request function
 * @returns {Promise} needed for unit test
 */
export const callAPIRequest = (preState, action, dispatch) => {
  const { asyncAction, args, type } = action;
  return asyncAction(preState, dispatch)
    .then(res => {
      dispatch(fetchSuccess(type, res, args));
      return res;
    })
    .catch(err => {
      dispatch(fetchFailure(type, err, args));
      return err;
    });
};

export const handleAPIAction = (getState, action, dispatch) => {
  callAPIRequest(getState, action, dispatch);
  const preState = getState();
  // if (!type) return { values: preState };
  return {
    values: {
      ...preState,
      requests: {
        ...preState.requests,
        [action.type]: { status: STATUS.PENDING},
      },
    },
  };
};

export const handleFetchComplete = (preState, action, reducer) => {
  const data = { status: action.status };
  const newAction = { ...action };
  switch (action.status) {
    case 'success':
      data.res = action.res
      newAction.type = requestSuccessAction(action.type);
      break;
    case 'failure':
      data.err = action.err
      newAction.type = requestFailureAction(action.type);
      break;
    default:
      return { values: reducer(preState, action) };
  }
  const newState = {
    ...preState,
    requests: {
      ...preState.requests,
      [action.type]: data,
    },
  };
  return { values: reducer(newState, newAction) };
};


/**
 * Creates a stateProvider, which is the wrapper for the parent component
 * const stateProvider = createStateProvider(...)
 * const AppWithState = stateProvider(App)
 * @param {Object} store a instance of LocalStore, imported from 'localStore.js' file
 * @param {function} reducer for state change, same reducer as Redux
 * @return {Class} new stateful React component
 */
export const createStateProvider = (store, reducer, shouldCacheState = false) => (
  WrappedComponent,
  injectProviderProps,
) => {
  let cachedLocalState = reducer(undefined, {});
  class ComponentWithLocalState extends Component {
    state = { values: shouldCacheState ? cachedLocalState : reducer(undefined, {}) };
    dispatch = action => {
      this.setState(
        preState => {
          if (action.redoable) store.cacheState(preState.values);
          if (action.status) {
            return handleFetchComplete(preState.values, action, reducer);
          }
          if (action.type === LOCAL_UNDO) return { values: store.rewindState() };
          if (action.type === LOCAL_REDO) return { values: store.forwardState() };
          if (action.asyncAction) {
            return handleAPIAction(store.getState, action, this.dispatch);
          }
          return { values: reducer(preState.values, action) };
        },
        () => {
          if (shouldCacheState) cachedLocalState = this.state.values;
        },
      );
    };
    render() {
      store.setContext({ state: this.state.values, dispatch: this.dispatch });
      const { StateContext, context } = store;
      if (injectProviderProps) {
        return (
          <StateContext.Provider value={context}>
            <StateContext.Consumer>
              {({ state, dispatch }) => (
                <WrappedComponent {...injectProviderProps(state, dispatch, this.props)} {...this.props} />
              )}
            </StateContext.Consumer>
          </StateContext.Provider>
        );
      }
      return (
        <StateContext.Provider value={context}>
          <WrappedComponent {...this.props} />
        </StateContext.Provider>
      );
    }
  }
  return ComponentWithLocalState;
};

/**
 * Create stateConsumer, which is the wrapper for child state consumming component
 * const stateConsumer = createStateConsumer(store)
 * const ChildWithContext = stateConsumer(Child)
 * @param {Object} store instance of LocalStore, imported from 'localStore.js' file
 */
export const createStateConsumer = ({ StateContext }) => (
  injectProviderProps = () => ({}),
) => WrappedComponent => props => (
  <StateContext.Consumer>
    {({ state, dispatch }) => <WrappedComponent {...injectProviderProps(state, dispatch, props)} {...props} />}
  </StateContext.Consumer>
);

export const selectRequestData = (state, actionType) =>
  (state.requests && state.requests[actionType] && state.requests[actionType].res);

export const selectRequestStatus = (state, actionType) =>
  (state.requests && state.requests[actionType] && state.requests[actionType].status);