import React, { createContext } from 'react';
import { shallow, mount } from 'enzyme';
import PropTypes from 'prop-types';
import { STATUS } from './actions'
import {
  handleAPIAction,
  callAPIRequest,
  handleFetchComplete,
  createStateConsumer,
  createStateProvider,
} from './stateManager';
import { fetchSuccess } from './actions';

const dispatch = jest.fn(action => action.type);
const successRes = { data: 'success' };
const failureRes = { data: 'failure' };
const type = 'ACTION_NAME';
const asyncAction = (isSuccess) => async () => {
  if (isSuccess) return successRes;
  return failureRes;
};
const preState = {
  values: {},
};

const getState = () => preState
const initialState = {};
const reducer = (state = initialState) => state;

const action = { asyncAction: asyncAction(true), type, args:[true] };
const failureAction = { asyncAction: asyncAction(false), type, args:[true] };

describe('localStateManager', () => {
  describe('callAPIRequest', () => {
    it('should call request with success', () => {
      expect.assertions(1);
      return expect(callAPIRequest(preState, action, dispatch)).resolves.toEqual(successRes);
    });
    it('should call request with failure', () => {
      expect.assertions(1);
      return expect(callAPIRequest(preState, failureAction, dispatch)).resolves.toEqual(failureRes);
    });
  });
  describe('handleAPIAction', () => {
    it('should start pending state', () => {
      const newState = handleAPIAction(getState, action, dispatch);
      expect(newState.values.requests[action.type].status).toBe(STATUS.PENDING);
    });
  });
  describe('handleFetchComplete', () => {
    it('end the pending state', () => {
      const successAction = fetchSuccess(type, 'res', [true])
      const newStateB = handleFetchComplete(preState, successAction, reducer);
      expect(newStateB.values.requests[action.type].status).toBe(STATUS.SUCCESS);
    });
  });
  class MockStore {
    cacheSize = 100;
    context = {
      state: { values: {} },
      dispatch: () => {},
    };
    StateContext = createContext(this.context);
    pastStates = [];
    futureStates = [];
    setContext = jest.fn(_args => _args);
    cacheState = jest.fn(_args => _args);
    rewindState = jest.fn(() => ({ values: 1 }));
    forwardState = jest.fn(() => ({ values: 1 }));
  }
  const Mock = props => (
    <button id="mock" onClick={props.dispatch}>
      {props.state}
    </button>
  );
  Mock.propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.string,
  };

  xdescribe('createStateProvider', () => {
    const store = new MockStore();
    const MockWithState = createStateProvider(store, reducer, true)(Mock);
    const wrapper = shallow(<MockWithState />);
    const instance = wrapper.instance();
    it('should set initial state', () => {
      expect(wrapper.state().values).toBe(initialState);
    });
    it('should set the context', () => {
      expect(store.setContext.mock.calls.length).toBe(1);
    });
    it('should be able to cacheState', () => {
      instance.dispatch({ redoable: true });
      expect(store.cacheState.mock.calls.length).toBe(1);
    });
    it('should be able to undo', () => {
      instance.dispatch({ type: 'LOCAL_UNDO' });
      expect(store.rewindState.mock.calls.length).toBe(1);
    });
    it('should be able to redo', () => {
      instance.dispatch({ type: 'LOCAL_REDO' });
      expect(store.forwardState.mock.calls.length).toBe(1);
    });
  });
  xdescribe('createStateConsumer', () => {
    const store = new MockStore();
    const mockContext = {
      state: 'state',
      dispatch: jest.fn(_action => _action),
    };
    const injectProviderProps = (_state, _dispatch) => ({ state: _state, dispatch: _dispatch });
    const MockConsumer = createStateConsumer(store)(injectProviderProps)(Mock);
    store.context = mockContext;
    const MockParent = () => <MockConsumer />;
    const MockParentWithState = createStateProvider(store, reducer, true)(MockParent);
    const wrapper = mount(<MockParentWithState />);
    it('should pass down dispatch', () => {
      expect(wrapper.find('#mock').props().onClick).toBe(mockContext.dispatch);
    });
    it('should pass down state', () => {
      expect(wrapper.find('#mock').props().children).toBe(mockContext.state);
    });
  });
});
