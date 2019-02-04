/* eslint-disable */

import Store from './store';

xdescribe('Helpers/state manager/store', () => {
  const store = new Store()
  const mockState = {}
  const mockDispatch = () => {}
  const mockContext = {
    state: mockState,
    dispatch: mockDispatch,
  };
  describe('setContext', () => {
    store.setContext(mockContext)
    it('should set state', () => {
      expect(store.getState()).toBe(mockState)
    })
    it('should set dispatch', () => {
      expect(store.dispatch).toBe(mockDispatch)
    })
  })
  describe('cacheState', () => {
    it('should cache states', () => {
      for (var i = 1; i <= store.cacheSize; i ++) {
        store.cacheState({ counter: i })
      }
      expect(store.pastStates.length).toBe(store.cacheSize)
      const lastState = store.pastStates[store.pastStates.length - 1]
      expect(lastState.counter).toBe(store.cacheSize)
    })
    it('should cache up to cacheSize of states', () => {
      const newState = { counter: store.cacheSize + 1 }
      store.cacheState(newState)
      expect(store.pastStates.length).toBe(store.cacheSize)
      const lastState = store.pastStates[store.pastStates.length - 1]
      expect(lastState.counter).toBe(store.cacheSize + 1)

    })
  })
  describe('rewindState', () => {
    let pastState;
    it('should return the rewind state', () => {
      for (var i = 1; i <= 50; i ++) {
        store.context.state = { counter: i }
        pastState = store.rewindState()
      }
      expect(store.pastStates.length).toBe(50)
      expect(pastState.counter).toBe(52)
      expect(store.futureStates.length).toBe(50)
    })
  })
  describe('forwardState', () => {
    let pastState;
    it('should return the forward state', () => {
      for (var i = 1; i <= 30; i ++) {
        store.context.state = { counter: i }
        pastState = store.forwardState()
      }
      expect(store.pastStates.length).toBe(80)
      expect(store.futureStates.length).toBe(20)
    })
  })
  describe('resetState', () => {
    it('should reset past and future state', () => {
      store.resetStates()
      expect(store.pastStates.length).toBe(0)
      expect(store.futureStates.length).toBe(0)
    })
  })
  describe('is redoable or undoable', () => {
    it('should disable undo/redo if there is no cached state', () => {
      expect(store.isRedoable).toBe(false)
      expect(store.isUndoable).toBe(false)
    })
  })
})
