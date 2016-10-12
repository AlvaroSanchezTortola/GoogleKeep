import undoable, { distinctState } from 'redux-undo';
import { visibilityFilter } from './visibility';

const listTodo = (state = {}, action ) => {
  switch(action.type) {
    case 'ADD_LIST_TODO':
      return {
        ...action.payload,
        archived: false
      };    
    case 'CHANGE_COLOR_LIST_TODO':
      if (state.id === action.payload.id) {
        return {
          ...state,
          color: action.payload.color
        }
      }
    case 'SET_VISIBILITY_FILTER':
    if (state.id === action.payload.idList) {
      return {
        ...state,
        visibilityFilter: visibilityFilter(state.visibilityFilter, action)
      }
    }
    default:
      return state;
  }
}

const listTodos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_LIST_TODO':
      return [
        ...state,
        listTodo(undefined, action)
      ];
    
    case 'EDIT_LIST_TODO':
      return state.map(l => listTodo(l, action));
    
    case 'CHANGE_COLOR_LIST_TODO':
      return state.map(l => listTodo(l, action));
    
    case 'DELETE_LIST_TODO':
      return state.filter(l => l.id !== action.payload.id);
    
    case 'SET_VISIBILITY_FILTER':
      return state.map(t => listTodo(t, action));
    
    default:
      return state;
  }
}

export { listTodos };