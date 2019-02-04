/* eslint-disable */
import * as actions from './actions';

describe('state manager built-in actions', () => {
  describe('undo/redo', () => {
    it('should return correct type', () => {
      expect(actions.redo().type).toBe(actions.LOCAL_REDO)
      expect(actions.undo().type).toBe(actions.LOCAL_UNDO)
    })
  })
  describe('fetchSuccess/Failure', () => {
    const args = ['type', 'res', 'args']
    it('should return correct type', () => {
      expect(actions.fetchSuccess(...args).status).toBe(actions.STATUS.SUCCESS)
      expect(actions.fetchFailure(...args).status).toBe(actions.STATUS.FAILURE)
    })
  })
})