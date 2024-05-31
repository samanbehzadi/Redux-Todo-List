import { addTodo, doTodo, getAllTodos, removeTodo } from '../Redux/actions.js';
import { addTodoAction, removeTodoAction, doTodoAction, getAllTodosAction } from '../Redux/actionCreators.js';

window.removeTodoHandler = removeTodoHandler
window.completeTodoHandler = completeTodoHandler
// window.filterCompletedTodosHandler = filterCompletedTodosHandler

// DOM Elements
const todoInputElem = document.querySelector('.todo-input')
const addTodoButton = document.querySelector('.todo-button')
const todoListUL = document.querySelector('.todo-list')
const filterTodoElem = document.querySelector('.filter-todo')

//  Create Todo List Reducer
function todoListReducer(state = [], action) {
    switch (action.type) {
        case addTodo: {
            console.log(action);
            let copyState = [...state]
            let newTodoObj = { id: crypto.randomUUID(), title: action.title, isCompleted: false }
            copyState.push(newTodoObj)
            return copyState
        }
        case removeTodo: {
            let copiedState = [...state]
            let updatedStore = copiedState.filter(todo => todo.id !== action.id)
            return updatedStore
        }
        case doTodo: {
            let newState = [...state]
            newState.some(todo => {
                if(todo.id === action.id){
                    todo.isCompleted = !todo.isCompleted
                }
            })
            return newState
        }
        case getAllTodos: {
            return state
        }
        default: { return state }
    }
}

// Create Store
const store = Redux.createStore(todoListReducer)

// Assign Event to Button
addTodoButton.addEventListener('click', e => {
    e.preventDefault()
    let titleOfNewTodo = todoInputElem.value.trim()
    if (titleOfNewTodo !== '') {
        store.dispatch(addTodoAction(titleOfNewTodo))
    } else { alert('You have to Write something to ADD') }
    const allTodos = store.getState()
    todoInputElem.value = ''
    addTodosInDOM(allTodos)

})
// Asign Event to FILTER Input
filterTodoElem.addEventListener('change', (e)=>{
    store.dispatch(getAllTodosAction())
    let allTodos = store.getState()
    if(e.target.value === 'all'){
        addTodosInDOM(allTodos)
    } else if(e.target.value === 'completed'){
        let completedTodos = allTodos.filter(todo => todo.isCompleted)
        addTodosInDOM(completedTodos)
    } else if(e.target.value === 'inProgress'){
        let inCompletedTodos = allTodos.filter(todo => !todo.isCompleted)
        addTodosInDOM(inCompletedTodos)
    }
})
// Add Todos to DOM
function addTodosInDOM(todos) {
    todoListUL.innerHTML = ''
    todos.forEach(todo => {
        todoListUL.insertAdjacentHTML('beforeend', `
        <li class="todo-item ${todo.isCompleted && 'completed'}">
            ${todo.title}
            <div class=''>
                <button class="btn btn-sm btn-primary" onclick=completeTodoHandler('${todo.id}')>
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick=removeTodoHandler("${todo.id}")>
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
        `)
    })
}
// we can NOT assign eventHandler for a Tag when we ues attribute TYPE for our SCRIPT
// to solve this we should bind our handlers to window
function removeTodoHandler(todoID) {
    store.dispatch(removeTodoAction(todoID))
    const updatedTodosList = store.getState()
    addTodosInDOM(updatedTodosList)
}

function completeTodoHandler(todoID){
    store.dispatch({type: 'DO_TODO', id: todoID})
    const allTodos = store.getState()
    addTodosInDOM(allTodos)
}
