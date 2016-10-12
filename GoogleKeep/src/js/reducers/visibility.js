import undoable, { distinctState } from 'redux-undo';

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch(action.type){
    case 'SET_VISIBILITY_FILTER':
      return action.payload.visibilityFilter;
    default:
      return state;
  }
}

export { visibilityFilter };