import undoable, { distinctState } from 'redux-undo';

const todo = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        ...action.payload,
        completed: false,
      };
    case 'TOGGLE_TODO':
      if(state.id === action.payload.id){
        return {
          ...state,
          completed: !state.completed
        };
      }
    case 'SAVE_TODO':
      if (state.id === action.payload.id) {
        return {
          ...state,
          saved: true
        }
      }
    case 'EDIT_TODO':
      if (state.id === action.payload.id){
        return {
          ...state,
          text: action.payload.text
        }
      }
    default:
      return state;
  }
}

const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    
    case 'SAVE_TODO':
      return state.map(t => todo(t, action));
    
    case 'EDIT_TODO':
      return state.map(t => todo(t, action));
    
    case 'DELETE_TODO':
      return state.filter(t => t.id !== action.payload.id);
  
    default:
      return state;
  }
}

const undoableTodos = () => {undoable(todos)}

export { todos };