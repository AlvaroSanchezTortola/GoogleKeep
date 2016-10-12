import undoable, { distinctState } from 'redux-undo';

const noteTodo = (state = {}, action ) => {
  switch(action.type) {
    case 'ADD_LIST_NOTE':
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

const listNotes = (state = [], action) => {
  switch (action.type) {
    case 'ADD_LIST_NOTE':
      return [
        ...state,
        noteTodo(undefined, action)
      ];
    default:
      return state;
  }
}

export { listNotes };