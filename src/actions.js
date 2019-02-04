import { plusOne, plusTwo, plusThree } from './api';

export const CHANGE_CURRENT = 'CHANGE_CURRENT';
export const FETCH_DATA = 'FETCH_DATA';


export const setCurrent = newNumber => ({
  type: CHANGE_CURRENT,
  newNumber,
});

export const fetchDataRequest = initialNumber => async (getState, dispatch) => {
  try {
    const newNumber1 = await plusOne(initialNumber + getState().currentNumber);
    dispatch(setCurrent(newNumber1));
    const newNumber2 = await plusTwo(getState().currentNumber);
    dispatch(setCurrent(newNumber2));
    const newNumber3 = await plusThree(getState().currentNumber);
    dispatch(setCurrent(newNumber3));
    return newNumber3;
  } catch (err) {
    return err;
  }
};

export const fetchData = (...args) => ({
  type: FETCH_DATA,
  asyncAction: fetchDataRequest(...args),
  args,
});