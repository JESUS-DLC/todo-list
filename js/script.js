'use strict';
const todo = document.querySelector('.todo__content')

const btnFilter = document.getElementById('filter');
const radioAll = document.getElementById('all');
const radioCompleted = document.getElementById('completed');
const radioIncomplete = document.getElementById('incomplete');

const title = document.querySelector('.add__title');
const description = document.querySelector('.add__description');
const btnAdd = document.getElementById('add');

const back = document.querySelector('.back');

const form = document.querySelector('.edit-form');
const titleEdit = document.querySelector('.edit__title');
const descriptionEdit = document.querySelector('.edit__description');
const idEdit = document.querySelector('.edit__id');
const btnEdit = document.getElementById('edit');

let idCount = 0;
let todoList = [];

const limpiarHTML = function () {
    while (todo.firstChild) {
        todo.removeChild(todo.firstChild)
    }
    title.value = '';
    description.value = '';
}

const toggleModal = function () {
    back.classList.toggle('hidden');
    form.classList.toggle('hidden');
    form.classList.toggle('form-position');
}


const fillTodo = function (todoHTML) {
    limpiarHTML();
    todoHTML.forEach(element => {
        const tr = document.createElement('tr');
        tr.classList.add('todo__element')

        const id = document.createElement('input');
        id.classList.add('id');
        id.type = 'hidden';
        
        const title = document.createElement('td');
        title.classList.add('todo__title');
        
        const description = document.createElement('td');
        description.classList.add('todo__description');
        
        const status = document.createElement('td');
        status.classList.add('todo__status');
        const statusInp = document.createElement('input');
        statusInp.classList.add('status');
        statusInp.type = 'checkbox';
        
        const buttons = document.createElement('td');
        buttons.classList.add('todo__actions');
        const deleteBtn = document.createElement('a');
        deleteBtn.classList.add('todo__delete');
        const svgDelete = document.createElement('img');
        svgDelete.src = 'img/delete.svg';
        deleteBtn.append(svgDelete);
        const editBtn = document.createElement('a');
        editBtn.classList.add('todo__edit');
        const svgEdit = document.createElement('img');
        svgEdit.src = 'img/edit.svg';
        editBtn.append(svgEdit);

        id.value = element.id;
        title.textContent = element.title;
        description.textContent = element.description;
        status.append(statusInp);
        statusInp.checked = element.status;

        buttons.append(editBtn);
        buttons.append(deleteBtn);
        tr.appendChild(id);
        tr.append(title);
        tr.append(description);
        tr.append(status);
        tr.append(buttons);
        todo.append(tr);
    });
}

const crearTodo = function () {
    if (title.value != '' && description.value != '') {
        const todoObj = {
            id: ++idCount,
            title: title.value,
            description: description.value,
            status: false,
        }
        todoList.push(todoObj);
        localStorage.setItem("todo", JSON.stringify(todoList))
        fillTodo(todoList);
    }
}

const checkTodo = function (e) {
    const todoContainer = e.target.parentElement.parentElement;
    const idTodoCheck = todoContainer.querySelector('input').value;
    const todoObj = todoList.find(todo => todo.id == idTodoCheck);
    if(!todoObj) return;
    todoObj.status = !todoObj.status;
    localStorage.setItem("todo", JSON.stringify(todoList));
}

const updateTodo = function () {
    const todoObj = todoList.find(todo => todo.id == idEdit.value)
    if(!todoObj) return;
    todoObj.title = titleEdit.value;
    todoObj.description = descriptionEdit.value;
    localStorage.setItem("todo", JSON.stringify(todoList))
    fillTodo(todoList);
    toggleModal();
    idEdit.value = '';
    titleEdit.value = '';
    descriptionEdit.value = '';
}

const editTodo = function (e) {
    toggleModal();
    const todoContainer = e.target.parentElement.parentElement.parentElement;
    idEdit.value = todoContainer.querySelector('.id').value
    titleEdit.value = todoContainer.querySelector('.todo__title').textContent;
    descriptionEdit.value = todoContainer.querySelector('.todo__description').textContent;
}

const deleteTodo = function (e) {
    const todoContainer = e.target.parentElement.parentElement.parentElement;
    const idTodoDelete = todoContainer.querySelector('input').value;
    const indexTodo = todoList.findIndex(todo => todo.id == idTodoDelete);
    todoList.splice(indexTodo, 1);
    localStorage.setItem("todo", JSON.stringify(todoList));
    fillTodo(todoList);
}

const todoActions = function (e) {
    if (e.target.classList.contains('todo__delete') || e.target.parentElement.classList.contains('todo__delete')) {
        deleteTodo(e);
    } if (e.target.classList.contains('todo__edit') || e.target.parentElement.classList.contains('todo__edit')) {
        editTodo(e);
    } if (e.target.classList.contains('status')) {
        checkTodo(e);
    }
}

const filterTodo = function (e) {
    e.preventDefault();
    if (radioAll.checked == true) {
        fillTodo(todoList);
    } else if (radioCompleted.checked == true) {
        let todoCompleted = todoList.filter(todo => todo.status == true);
        fillTodo(todoCompleted);
    } else {
        let todoIncomplete = todoList.filter(todo => todo.status == false);
        fillTodo(todoIncomplete);
    }
}

btnAdd.addEventListener('click', crearTodo)
todo.addEventListener('click', todoActions)
btnEdit.addEventListener('click', updateTodo)
btnFilter.addEventListener('click', filterTodo)
back.addEventListener('click', toggleModal)

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
        back.classList.add('hidden');
        form.classList.add('hidden');
        form.classList.add('form-position');
    };
})

if (localStorage.getItem('todo') !== null) {
    todoList = JSON.parse(localStorage.getItem('todo'));
    fillTodo(todoList);
}


