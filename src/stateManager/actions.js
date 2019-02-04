export const LOCAL_REDO = 'LOCAL_REDO';
export const LOCAL_UNDO = 'LOCAL_UNDO';

export const STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PENDING: 'pending',
}

/**
 * create the type of the action, which is dispatched after server request is successful.
 * @param {string} actionName type of the action
 * @return {string}
 */
export const requestSuccessAction = actionName => `${actionName}_SUCCESS`;
/**
 * create the type of the action, which is dispatched after server request is failed.
 * @param {string} actionName type of the action
 * @return {string}
 */
export const requestFailureAction = actionName => `${actionName}_FAILURE`;

export const redo = () => ({
  type: LOCAL_REDO,
});

export const undo = () => ({
  type: LOCAL_UNDO,
});

export const fetchSuccess = (type, res, requestArgs) => ({
  type,
  res,
  requestArgs,
  status: STATUS.SUCCESS,
});

export const fetchFailure = (type, err, requestArgs) => ({
  type,
  err,
  requestArgs,
  status: STATUS.FAILURE,
});
