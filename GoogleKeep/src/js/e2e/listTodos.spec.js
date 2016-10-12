import listTodos from '../reducers/listTodos';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

const testAddListTodo = () => {
  const stateBefore = [];

  const action = {
    type: 'ADD_LIST_TODO',
    payload: {
      id: 0,
      text: 'Limpiar mi JARDIN'
    }
  }

  const stateAfter = [{
    id: 0,
    text: 'Limpiar mi JARDIN',
    archived: false
  }];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
}

const testChangeColor = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Limpiar mi sala',
      color: blue
    },
  ];

  const action = {
    type: 'CHANGE_COLOR_LIST_TODO',
    payload: {
      id: 0
    }
  }

  const stateAfter = [
    {
      id: 0,
      text: 'Limpiar mi sala',
      color: red
    },
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
}


testAddListTodo();
testChangeColor();
console.log("All todo tests passed!");

export { testAddListTodo };