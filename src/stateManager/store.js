import { createContext } from 'react';

class Store {
  cacheSize = 100;
  context = {
    state: {},
    dispatch: () => {},
  };
  StateContext = createContext(this.context);
  pastStates = [];
  futureStates = [];
  getState = () => {
    return this.context.state;
  }
  get dispatch() {
    return this.context.dispatch;
  }
  get isRedoable() {
    return this.futureStates.length > 0;
  }
  get isUndoable() {
    return this.pastStates.length > 0;
  }

  setContext = context => {
    this.context = context;
  };

  cleanPastStates = () => {
    if (this.pastStates.length > this.cacheSize) this.pastStates.shift();
  };
  resetStates = () => {
    this.pastStates = [];
    this.futureStates = [];
  };

  cacheState = preState => {
    this.pastStates.push(preState);
    // if the user has performed redo before.
    // if any redoable action is dispatch, the user cannot recover future state
    this.futureStates = [];
    this.cleanPastStates();
  };

  rewindState = () => {
    if (this.pastStates.length === 0) return this.getState();
    const pastState = this.pastStates.pop();
    this.futureStates.push(this.getState());
    return pastState;
  };

  forwardState = () => {
    if (this.futureStates.length === 0) return this.getState();
    const futureState = this.futureStates.pop();
    this.pastStates.push(this.getState());
    this.cleanPastStates();
    return futureState;
  };
}

export default Store;
