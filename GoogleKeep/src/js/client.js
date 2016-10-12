import { createStore, combineReducers, applyMiddleware } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import expect from 'expect';
import '../styles/index.scss';
//import * from './e2e/listTodos.spec';
//import testAddTodo from './e2e/todos.spec';

import Immutable from 'immutable';

import { ActionCreators as UndoActionCreators } from 'redux-undo';
import undoable from 'redux-undo';

import { todos } from './reducers/todos';
import { visibilityFilter } from './reducers/visibility';
import { colours } from './containers/colors';
import { listTodos } from './reducers/listTodos';
import { listNotes } from './reducers/notes';

const { Component } = React;

const todoApp = combineReducers({
  todos,
  visibilityFilter,
  listTodos,
  listNotes,
});

const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {}

const store = createStore(todoApp, persistedState, applyMiddleware(logger));

//tomado de http://redux.js.org/docs/api/applyMiddleware.html
function logger({ getState }) {
  return (next) => (action) => {
    console.log('will dispatch', action)

    let returnValue = next(action)

    console.log('state after dispatch', getState())
    return returnValue
  }
}

const FilterLink = ({visibilityFilter, currentVisibilityFilter,children, idList}) => {
  if (visibilityFilter === currentVisibilityFilter) {
  return <strong> { children } </strong>;
  }
  return <a
    href="#"
    onClick={
      (e) => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          payload: { 
            idList,
            visibilityFilter
          }
        });
      }
    }
    >
  { children } </a>
}

const getVisibleTodos = (todos, visibilityFilter) => {
  if(visibilityFilter === 'SHOW_ALL'){
    return todos;
  }

  if(visibilityFilter === 'SHOW_COMPLETED'){
    return todos.filter(t => t.completed);
  }

  if(visibilityFilter === 'SHOW_ACTIVE'){
    return todos.filter(t => !t.completed);
  }
  return todos;
}

const getCreatedTodo = (todos, idList)  => {
  return todos.filter(v => v.idList === idList);
}

class ListTodos extends Component {
  render() {  
  let {todos, listTodo } = this.props;
  let now = new Date().toLocaleDateString();

  return (

    <div ref = { 'color_list' }  class= { 'list-background' }>
      
      <SearchBar />
      <input ref = { "todo_title" } class={ 'note-title-input' }/>

      <div class= { 'main-container' }>
      <input 
        class = { 'note-body-input' }
        onKeyPress={
          (e) => { if (e.key === 'Enter') {
             store.dispatch({
              type: 'ADD_TODO',
              payload: {
                id: maxIdList++,
                text: this.input.value,
                idList: idLists
              }
            }); this.input.value = "";
            }
          }
        } ref={ node => this.input = node } 
        />       
      </div>
      <ContainerTodo 
        todos = { todos }
        id = { idLists }
        visibilityFilter = { listTodo.visibilityFilter } key= { 1 }        
        ></ContainerTodo>
      <button               
        onClick={
          () => { 
            store.dispatch({
              type: 'ADD_LIST_TODO',
              payload: {
                id: idLists++,
                color: this.refs.color_list.style.backgroundColor,
                title: this.refs.todo_title.value,
                fecha: now,
              }
            });             
            this.refs.color_list.style.backgroundColor = '';
            this.refs.todo_title.value = ''; 
          }
        }
      >Guardar Lista</button>     
    </div>
  	);
  }
}

class SavedListTodos extends Component {
  render() {
    let { todos, listTodos, } = this.props;
    let now = new Date().toLocaleDateString();

    if (typeof listTodos === 'undefined') {
      listTodos = [];
    }
    return (
        <div>
        {
          listTodos.map((list, i) =>
             <div 
              ref = { 'color_list' }
              class= { 'list-background' }
              style = {{ backgroundColor: list.color }}  key = { i } >
              <input 
                defaultValue = { list.title }
                class={ 'note-title-input' }
                ref= { "todo_title" }
                onChange={
                    () => { 
                      store.dispatch({
                        type: 'EDIT_LIST_TODO',
                        payload: {
                          id: list.id,
                          title: this.refs.todo_title.value,
                        }
                      });
                    }
                  }
              />
              <ContainerTodo 
                todos = { todos }
                id = { list.id }
                visibilityFilter = { list.visibilityFilter } key= { 1 }
              ></ContainerTodo>
              <div class= { 'note-body' } >
               <div ref = { 'color' } >
                 <ColorTodo
                   refs = { this.refs } listTodo = { list } >
                 </ColorTodo>
                 </div>
                <button                  
                  onClick={
                    () => { 
                      store.dispatch({
                        type: 'DELETE_LIST_TODO',
                        payload: {
                          id: list.id
                        }
                      });
                    }
                  }
                >           
                Borrar
                </button>
                <div defaultValue = { this.props.fecha }></div>
                <div>{now}</div>                                  
                </div>
              </div>
              )
            }
      </div>
    );
  }
}

class ContainerTodo extends Component {
  render() {
  let { todos, id, visibilityFilter } = this.props;
  let visibleTodos = getVisibleTodos(getCreatedTodo(todos, id), visibilityFilter);

  return (
    <div> {
    visibleTodos.map(
      (todo, i) => 
        <div key= { i } >
        <button          
          onClick={
            () => { 
              store.dispatch({
                type: 'DELETE_TODO',
                payload: {
                  id: todo.id
                }
              });
            }
          } >
        BorrarTodo</button>
      </div>
     )}
    </div>
    );
  }
}

class ColorTodo extends Component {
  render () {
    let { refs, listTodo } = this.props;

    return (
      <div> {
      colours.map(
        (color, i) => 
          <div key = { i } class = { color.class } 
          onClick = {
              () => {
                store.dispatch({
                  type: 'CHANGE_COLOR_LIST_TODO',
                  payload: {
                    id: listTodo.id,
                    color: color.div_color
                  }
                })
              }
            }
          >
        </div>
      )}
      </div>
    );
  }
}

let maxIdt = 0;
class TodosApp extends Component {
  render() {
    let { todos, visibilityFilter } = this.props;
    let visibleTodos = getVisibleTodos(todos, visibilityFilter);
    
    return (
      <div>
        <input type="text" 
              class= { 'todo-title-input' } 
              ref={ node => this.input = node } />
        <button
          onClick={
            () => { 
              store.dispatch({
                type: 'ADD_TODO',
                payload: {
                  id: maxIdt++,
                  text: this.input.value
                }
              });

              this.input.value = "";
            }
          }
        >Agregar Todo</button>
        <button
          onClick={
            () => { 
              store.dispatch(UndoActionCreators.undo());
            }
          }
        >UNDO</button>
        <ul>
          {
            visibleTodos.map(
              todo => <li
                key={ todo.id }
                style={
                  {
                    textDecoration: todo.completed ? 'line-through' : 'none'
                  }
                }
                onClick={
                  () => {
                    store.dispatch({
                      type: 'TOGGLE_TODO',
                      payload: {
                        id: todo.id
                      }
                    });
                  }
                }>
                { todo.text }
              </li>
            )
          }
        </ul>
        <div>
          Show:
          <FilterLink
            visibilityFilter="SHOW_ALL"
            currentVisibilityFilter={ visibilityFilter }>All</FilterLink>
          {' '}
          <FilterLink
            visibilityFilter="SHOW_COMPLETED"
            currentVisibilityFilter={ visibilityFilter }>Completed</FilterLink>
          {' '}
          <FilterLink
            visibilityFilter="SHOW_ACTIVE"
            currentVisibilityFilter={ visibilityFilter }>Active</FilterLink>
        </div>      
      </div>
    );
  }
}

let maxIdList = 0;
let idLists = 0;
class NotesApp extends Component {
  render() {
  let { todos, listTodos } = this.props;
  let visibleListTodos = listTodos.filter(l => l.archived === false);

  return (
    <div class="notes-container">
      <ListTodos
        todos = { todos }
        listTodo = { visibleListTodos } >
      </ListTodos>
      <SavedListTodos
        listTodos = { visibleListTodos }
        todos = { todos } >
      </SavedListTodos>
    </div>
   );
  }
}

class SearchBar extends Component{
  render(){
    let input;
    return (
      <input type="text" 
        placeholder="search 'mac'"
        class= { 'search-bar' } 
        ref={ node => input = node }
        onChange={()=>{
         if (!input) return;
         console.info('Searching '+ input.value);
            }
          } />
    );
  }
}

const render = () => {

  console.log(store.getState());

  ReactDOM.render(
    <div>
    <div class="barra">GoogleKeep</div>
    <NotesApp
      { ...store.getState() }
    />
    <TodosApp
      { ...store.getState() }
    />
    </div>,
    document.getElementById('root')
  );
};

render();
store.subscribe(render);
store.subscribe(()=>{
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})