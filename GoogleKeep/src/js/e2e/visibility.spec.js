import visibilityFilter from '../reducers/visibility';

const testSetVisibilityFilter = () => {
  const stateBefore = 'ALL';

  const action = {
    type: 'SET_VISIBILITY_FILTER',
    payload: {
      visibilityFilter: 'HIDE_COMPLETED'
    }
  }

  const stateAfter = 'HIDE_COMPLETED';

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    visibilityFilter(stateBefore, action)
  ).toEqual(stateAfter);
}

testToggleTodo();
console.log("All visibility filter tests passed!");