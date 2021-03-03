import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Accordion, Container, Form, FormControl, InputGroup } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import CustomDateInput from '../components/CustomDateInput';
import "react-datepicker/dist/react-datepicker.css";
import { ArrowReturnRight } from 'react-bootstrap-icons';

function TodoList() {

    const [todos, setTodos] = useState([]);
    const [todoName, setTodoName] = useState('');
    const [todoParent, setTodoParent] = useState();
    const [todoDescription, setTodoDescription] = useState('');
    const [parentTodos, setParentTodos] = useState([]);
    const [deadlineDate, setDeadlineDate ] = useState(new Date());

    // Update the Todos list
    async function makeGetRequest() {

        let res = await axios.get('https://localhost:5001/api/Todo');
        let data = res.data;
        let todosList = data.sort((a, b) => {return a.id - b.id});
        let finalList = _sortParentChildList(todosList);

        setTodos(finalList);

        console.log("make get request ----");
        console.log(finalList);

        let parents = finalList.filter((parent) => parent.parentId == null && parent.isComplete === false);
        setParentTodos(parents);
    };

    // Add the todo to the list
    async function _handleAdd() {
        let todoParentFormatted = '';
        if (todoParent === '') {
            todoParentFormatted = null;
        } else {
            todoParentFormatted = Number(todoParent);
        }
        console.log("adding - " + todoName);
        console.log("todoParent - " + todoParent);
        console.log("todoDescription - " + todoDescription);
        await axios.post('https://localhost:5001/api/Todo', {
            name: todoName,
            isComplete: false,
            description: todoDescription,
            parentId: todoParentFormatted,
            deadlineDate: deadlineDate
        })
        setTodoName('');
        setTodoDescription('');
        setDeadlineDate(new Date());
        setTodoParent('');
        makeGetRequest();
    };

    // Set the parentId for the child todo when selecting a parent todo
    async function _handleSelectChange(e) {
        setTodoParent(e.target.value);
    };

    // Delete a Todo
    async function _handleDelete(todo) {
        console.log("deleting - " + todo.name);

        if (todo.parentId === null) {
            let tempChildrenList = todos.filter(childTodo => childTodo.parentId === todo.id);
            console.log(tempChildrenList);
            tempChildrenList.forEach((tempChild) => {
                console.log(tempChild.id);
                axios.delete('https://localhost:5001/api/Todo/' + tempChild.id, {})
            })
        }

        await axios.delete('https://localhost:5001/api/Todo/' + todo.id, {})
        await makeGetRequest();
    };

    async function _handleComplete(todo) {
        console.log("completing - " + todo.id);

        // Check if parent is closing and if true, close all children that are not closed
        if (todo.parentId === null && todo.isComplete === false) {
            await axios.put('https://localhost:5001/api/Todo/' + todo.id, {
                id: todo.id,
                name: todo.name,
                isComplete: !todo.isComplete,
                description: todo.description,
                parentId: todo.parentId,
                deadlineDate: todo.deadlineDate
            });

            let tempChildrenList = todos.filter(childTodo => childTodo.parentId === todo.id);
            console.log(tempChildrenList);

            for (const childItem of tempChildrenList) {
                if(childItem.isComplete === false ) {
                    await axios.put('https://localhost:5001/api/Todo/' + childItem.id, {
                        id: childItem.id,
                        name: childItem.name,
                        isComplete: !childItem.isComplete,
                        description: childItem.description,
                        parentId: childItem.parentId,
                        deadlineDate: childItem.deadlineDate
                    });
                }
            }
            await makeGetRequest();
        } 

        // Check if Child is closing and if it is the last child closed, close the parent
        if (todo.parentId != null) {

            if (todo.isComplete === false) {
                await axios.put('https://localhost:5001/api/Todo/' + todo.id, {
                    id: todo.id,
                    name: todo.name,
                    isComplete: !todo.isComplete,
                    description: todo.description,
                    parentId: todo.parentId,
                    deadlineDate: todo.deadlineDate
                });
            }
            let tempChildrenList = todos.filter(childTodo => childTodo.parentId === todo.parentId && childTodo.id !== todo.id);
            console.log(tempChildrenList);
            let parentTodoItem = todos.find(todoItem => todoItem.id === todo.parentId);
            console.log(parentTodoItem);

            let results = tempChildrenList.some(obj => obj.isComplete === false);
            console.log(results);



            if (!results) {
                await axios.put('https://localhost:5001/api/Todo/' + parentTodoItem.id, {
                    id: parentTodoItem.id,
                    name: parentTodoItem.name,
                    isComplete: !parentTodoItem.isComplete,
                    description: parentTodoItem.description,
                    parentId: parentTodoItem.parentId,
                    deadlineDate: parentTodoItem.deadlineDate
                });
            }
            await makeGetRequest();
        }
    };

    function _sortParentChildList(todosList) {
        let parentChildList = [];

        // Get the name of each item in the list
        todosList.forEach((todo) => {
            if (todo.parentId === null) {
                parentChildList.push(todo)
                
                let childList = todosList.filter(child => child.parentId === todo.id);
                childList.forEach((childTodo) =>{
                    parentChildList.push(childTodo);
                })
            }
        });

        return parentChildList;
    };


    /* Run when the setTodos method is called */
    useEffect(() => {
        makeGetRequest();
    }, [setTodos]);

    return (
        <>
            <h2>SIG Todo List</h2>
            <hr />
            <div className="container">
                <div className="row">
                    <div className="w-50 pr-2 d-flex-column">
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="name-input">Name:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                type="text"
                                placeholder="Enter the Todo name"
                                aria-label="Name"
                                aria-describedby="name-input"
                                value={todoName}
                                onChange={(e) => setTodoName(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="details-input">Details:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                type="text"
                                placeholder="Enter the Todo details (optional)"
                                aria-label="Details"
                                aria-describedby="details-input"
                                value={todoDescription}
                                onChange={(e) => setTodoDescription(e.target.value)}
                            />
                        </InputGroup>
                        <Form inline className="align-items-start"> 
                        <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="date-input">Deadline:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <DatePicker
                                    selected={deadlineDate}
                                    onSelect={date => setDeadlineDate(date)}
                                    customInput={<CustomDateInput/>}
                                />
                            </InputGroup>
                            {parentTodos.length > 0 ?
                                (         
                                    <>    
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="parent-input">Parent Todo:</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        as="select"
                                        className="mr-sm-2"
                                        name="parentTodo"
                                        id="parentTodo"
                                        value={todoParent}
                                        custom
                                        onChange={(e) => _handleSelectChange(e)}
                                    >
                                        <option value={''}>Select (optional)...</option>
                                        {parentTodos.map((parent) => {
                                            return (
                                                <option value={parent.id} key={parent.id}>{parent.name}</option>
                                            )
                                        })}
                                    </FormControl>
                                </InputGroup>
                                </>
                                ) 
                                : (null)
                            }
                            <div style={{ width: "100%" }}></div>
                            <button type="button" className="btn btn-warning justify-start" onClick={() => _handleAdd()}>ADD THE TODO</button>
                        </Form> 
                        <div className="w-100 pr-2 mt-5 d-flex-column">
                            <h2>Instructions</h2>
                            <div className="w-100 mb-4 d-flex-column">
                                <ul>
                                    <li>Enter the name of the Todo</li>
                                    <li>Enter the todo details (optional)</li>
                                    <li>Click the deadline date button to set a date. (defaults to today)</li>
                                    <li>If there are parent todos, you will be able to select it to associate a child todo</li>
                                    <li>Click the "ADD THE TODO" button to add the todo to the list</li>
                                </ul>
                            </div>
                            <h2 className={`mb-3`}>How it works</h2>
                            <div className="w-100 my-1 d-flex">
                                <button type="button" className="btn btn-sm btn-success justify-start">◯</button>
                                <span className="ml-2 flex-grow-1" style={{ lineHeight: 2 }}>this button completes the Todo</span>
                            </div>
                            <div className="w-100 d-flex">
                                <button type="button" className="btn btn-sm btn-danger justify-start">✕</button>
                                <span className="ml-2 flex-grow-1"  style={{ lineHeight: 2 }}>this button delets the Todo (and children)</span>
                            </div>
                            <div className="w-100 pr-2 d-flex-column mt-4">
                                <li>When a parent todo is closed, all of the children close.</li>
                                <li>When all of the child todos close, the parent will close.</li>
                                <li>Deleting a parent todo will delete all child todos.</li>
                                <li>Todos cannot be re-opened.</li>
                            </div>
                        </div>
                    </div>
                    <div className="w-50 pl-2 pr-0">
                        {todos.map((todo, index) => {

                            // format the date
                            let formattedDate = new Date(todo.deadlineDate).toLocaleDateString('en-US');

                            // set the action buttons' status
                            let buttonDisabled = false; 
                            if (todo.isComplete === true) {
                                buttonDisabled = true;
                            }
                            
                            // Remove the bottom border if there are details
                            let borderBottomVal;
                            if (index < todos.length-1) {
                                borderBottomVal = 0;
                            } 
                            if (index >= todos.length-1) {
                                borderBottomVal = '1px solid rgba(0, 0, 0, 0.125)';
                            }

                            // If there is a description and the todo is not complete, show the expand option and detiails otherwise hide them
                            let showDescription = false;
                            if (todo.description !== "" && todo.isComplete === false) {
                                showDescription = true;
                            }

                            return (
                            <Accordion key={todo.id}>
                                <Accordion.Toggle as={Container} eventKey={todo.id} className={`p-0`}>
                                <div key={todo.id} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: borderBottomVal, backgroundColor: new Date(new Date(todo.deadlineDate).toDateString()) < new Date(new Date().toDateString()) ? ("#f8d7da") : ("var(--white)") }} className={`d-inline-flex flex-wrap list-group-item py-1 px-1 justify-content-between w-100`}>
                                    {todo.parentId && (<ArrowReturnRight size={16} className="mr-1" style={{ color: "#7a7c7f"}}/>)}
                                    <span className={`mr-auto ${todo.parentId && ("child-font")}`}>
                                        {todo.isComplete === true
                                            ? (<del>{todo.name}</del>)
                                            : (todo.name)
                                        }
                                    </span>
                                    <span className={`mx-2 ${todo.parentId && ("child-font")}`}>
                                        {todo.isComplete === true 
                                            ? (<del>{formattedDate}</del>) 
                                            : (formattedDate)}
                                    </span>                                    
                                    <button type="button" className="btn btn-sm btn-success ml-1" onClick={() => _handleComplete(todo)} disabled={buttonDisabled}>
                                        {todo.isComplete === true
                                            ? ("✓")
                                            : ("◯")}</button>
                                    <button type="button" className="btn btn-sm btn-danger ml-1" onClick={() => _handleDelete(todo)}>✕</button>
                                    <div style={{ width: "100%" }}></div>
                                    <span className={`details-font`}>
                                        {showDescription ? ("click for details...") : (<span>&nbsp;</span>)}
                                    </span>
                                </div>
                                </Accordion.Toggle>
                                {showDescription &&
                                            <Accordion.Collapse eventKey={todo.id}>
                                                    <div key={todo.id} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, backgroundColor: new Date(new Date(todo.deadlineDate).toDateString()) < new Date(new Date().toDateString()) ? ("#f8d7da") : ("var(--white)") }} className={`d-inline-flex flex-wrap list-group-item justify-content-between w-100 ${index === todos.length+1 ? ("border-top") : ("border-top-0")}`}>
                                                        Details: {todo.description}
                                                    </div>
                                            </Accordion.Collapse>
                                }
                            </Accordion>
                            )
                        })}
                    </div>
                </div>
            </div> 
        </>
    );
}

export default TodoList;