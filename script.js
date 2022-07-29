/* 
MY API KEY: 340 */

/* 
Über
fetch requests
promises
classes (und this in classes)
lesen

Davids Code durchlesen und kommentieren, was ich nicht verstehe, recherchieren
*/

/* 
TODOS
Only add a todo if input field is not empty OK
Otherwise, adding todos appears to work

NEXT: 
Remove todo OK
Toggle a todo OK
toggle all OK
Filter todos
Toggle all todos
Add loading animation that runs after every fetch request
When there are no todos, hide todo filters. Show text saying there are no todos.
Add ability to add todo by hitting Enter key
After adding todo, input field should be empty again
if all todos are active: toggle-all checkbox must be set to ''. If all todos are completed, set it to 'checked'

*/

/* QUESTIONS
Removing a todo seems slow - is this my mistake, or is the API?
*/

function ToDoFilters(props) {
  /* 
  Does filter status go in props or state? In state, because it is change by the user
  */
  return (
    <div className="row to-do-filters">
      <div className="col-12">
        <div className="filter-buttons d-flex flex-row justify-content-center mt-4">
          <button type="button" className="btn btn-primary mx-2 active" data-bs-toggle="button" autoComplete="off" aria-pressed="true">All to-dos button</button>
          <button type="button" className="btn btn-primary mx-2" data-bs-toggle="button" autoComplete="off">Active to-dos</button>
          <button type="button" className="btn btn-primary mx-2" data-bs-toggle="button" autoComplete="off">Completed to-dos</button>
        </div>
      </div>
    </div>
  )
}

function RenderToDos(props) {
  const {todos, onRemove, onToggle} = props;
  console.log('onToggle: ', onToggle);

  return (
    <div className="row rendered-to-dos">
      <div className="col-12">
        { todos.map((todo) => {
            return (
              <ul className="list-group list-group-horizontal rounded-0 bg-transparent" key={todo.id} dataid={todo.id}>
                <li
                  className="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                  <div className="form-check">
                    <input onChange={onToggle} className="form-check-input me-0" type="checkbox" value="" id="flexCheckChecked1"
                      aria-label="..." checked={todo.completed ? 'checked' : ''}/>
                  </div>
                </li>
                <li className="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                  <p className="lead fw-normal mb-0">{todo.content}</p>
                  {/* When editing to-do item, replace above p element with the following input element: */}
                  {/* <input className="me-0" type="text" /> */}
                </li>
                <li className="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                  <button onClick={onRemove} className="btn btn-danger" >Remove</button>
                </li>
              </ul>
            );
          })
        }
      </div>
    </div>
  );
}

class ToDoInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
    }

    this.handleInput = this.handleInput.bind(this);
  }

  handleInput() {
    this.setState({
      userInput: event.target.value,
    });
  }

  render() {
    let {todos, onSubmit, onToggleAll} = this.props;
    console.log('todos in ToDoInput: ', todos);

    console.log('this.state inside ToDoInput: ', this.state);
    return (
      <div className="row to-do-input">
        <div className="col-12">
          <div className="input-group mb-3">
            <div className="input-group-text">
              <input 
              onChange={onToggleAll} 
              className="form-check-input mt-0 toggleAll"
              type="checkbox"
              value="" 
              aria-label="Checkbox for following text input"
              checked={
                todos.every(todo => {
                  return todo.completed; 
                }) ? 'checked' : ''
              } 
              />
            </div>
            <input onChange={this.handleInput} type="text" className="form-control" aria-label="Text input with checkbox" placeholder="Your new todo" />
            <button onClick={onSubmit} className="btn btn-outline-secondary addTo-Do-Button" type="button" id="button-addon2">Add to-do</button>
          </div>
        </div>
      </div>
    );
  }
}

// Needs to make fetch request to get todos from API
class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      filterStatus: 'all'
    };

    this.fetchTodos = this.fetchTodos.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.checkTodoStatus = this.checkTodoStatus.bind(this);
    this.toggleTodo = this.toggleTodo.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  }

  componentDidMount() {
    this.fetchTodos();
  }
  
  fetchTodos() {
    console.log('state in fetchTodos:', this.state);
    fetch('https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=340').then(response => {
      if (response.ok) {
        console.log('response: ', response);
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then(data => {
      console.log('json data: ', data.tasks);
      // I only want to change one property in state - how do I do that?
      this.setState({
        todos: data.tasks,
      });
    }).catch(error => {
      console.log(error);
    });
  }


  /* ========= SUBMIT A NEW TODO =========== */
  // Why does the POST request look so different in Altcademy's version? ->
  // .then(checkStatus)
  //     .then(json)
  //     .then((data) => {
  //       this.setState({new_task: ''});
  //       this.fetchTasks();
  //     })
  handleSubmit() {
    // if what was added is not an empty string (trim it first)
    if(!event.target.previousElementSibling.value.trim()) {
      return;
    }
    
    // send POST request to add a new todo
    fetch('https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=340', {
      method: 'POST',
      mode: 'cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: {
          content: event.target.previousElementSibling.value,
        }
      }),
    }).then(response => {
      if (response.ok) {
        console.log('response: ', response);
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then(data => {
      console.log('data inside POST request', data);
      // call fetchTodos() - here or outside this fetch request? Works both ways.
      this.fetchTodos();
    }).catch(error => {
      console.log(error);
    });
  }


  /* ============ REMOVE A TODO ============ */
  handleRemove() {
    // The id of the todo item to be removed
    let todoId = +event.target.closest('ul').getAttribute('dataid');
    if(!todoId) {
      return;
    }

    fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${todoId}?api_key=340`, {
      method: 'DELETE',
      mode: 'cors',
    }).then(response => {
      if (response.ok) {
        console.log('response: ', response);
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then(data => {
      console.log('data inside handleRemove:', data);
      this.fetchTodos();
    }).catch(error => {
      console.log(error);
    });
  }


  /* ========= CHECK TODO COMPLETION STATUS ========= */
  checkTodoStatus() {
    let todoIdToToggle = +event.target.closest('ul').getAttribute('dataid');

    if (!todoIdToToggle) {
      return;
    }

    // Check completion status of the todo clicked
    /* Check completion status of todo inside this.state, not based on the check box. I want to rely on this.state as the 'single source of truth', in case something goes wrong with rendering the completion status before the user clicks toggle.  */
    this.state.todos.forEach(todo => {
      if (todo.id === todoIdToToggle) {
        if (todo.completed === false) {
          // Warum muss ich hier this. einfügen?
          this.toggleTodo('mark_complete', todo.id);
        } else {
          this.toggleTodo('mark_active', todo.id);
        }
      }
    });

    // V2: Check if checkbox is checked, run toggleTodo based on that
    // let todoStatus = event.target.checked;
    // console.log('todoStatus: ', todoStatus);
    // if (todoStatus === true) {
    //   this.toggleTodo('mark_complete', todoIdToToggle);
    // } else if (todoStatus === false) {
    //   this.toggleTodo('mark_active', todoIdToToggle);
    // }
  }

  /* ======= TOGGLE A TODO =========== */
  toggleTodo(toggleAction, todoId) {
    console.log('toggleTodo runs. toggleAction: ', toggleAction);
    /* if todo is active:
         set it to completed
       else if todo is completed:
         set it to active    
    */
    fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${+todoId}/${toggleAction}?api_key=340`, {
      method: 'PUT', 
      mode: 'cors',
    }).then(response => {
      if (response.ok) {
        console.log('response in toggleTodo: ', response);
        return response.json();
      }

      throw new Error('Request was either a 404 or 500');
    }).then(data => {
      console.log('data inside toggleTodo: ', data);
      this.fetchTodos();
    }).catch(error => {
      console.log(error);
    });  
  }


  /* ========== TOGGLE ALL TODOS ============ */
  toggleAll() {
    // If toggle-all checkbox is checked/not checked AFTER USER CLICKS ON IT - DOES NOT REFER TO ITS STATE BEFORE THE CLICK!!!
    if (event.target.checked === false) {
      // calling toggleToDo on every todo means that fetchTodos is called every time - is this a problem?
      // find all completed todos
        // send a request only for the completed ones
      let completedTodos = this.state.todos.filter(todo => {
        return todo.completed === true;
      });

      completedTodos.forEach(todo => {
        this.toggleTodo('mark_active', todo.id);
      });
    } else if (event.target.checked === true) {
      let activeTodos = this.state.todos.filter(todo => {
        return todo.completed === false;
      });

      console.log('activeTodos: ', activeTodos);

      activeTodos.forEach(todo => {
        this.toggleTodo('mark_complete', todo.id);
      });
    }
  }


  render() {
    const {todos} = this.state;
    console.log('state in render(): ', this.state);

    return (
      <div className="container">
        <div className="row to-do-list">
          <div className="col-12">
            <h1 className="text-center">To-Do-List</h1>
    
            <ToDoInput todos={this.state.todos} onSubmit={this.handleSubmit} onToggleAll={this.toggleAll}/>
    
            <RenderToDos todos={todos} onRemove={this.handleRemove} onToggle={this.checkTodoStatus}/>
            {/* RenderTo-Dos */}
            {/* <div className="row rendered-to-dos">
              <div className="col-12"> */}
                {/* className="list-group: Checkbox, to-do and button not aligned. Cannot access todo separately.  */}
                {/* To-do List as Table - works, but button is not center aligned. Try with flexbox.*/}
                {/* Another approach:  URL: https://mdbootstrap.com/docs/standard/extended/to-do-list/,*/}
                {/* I don't have to layout everything with rol and col, using flexbox on individual divs sometimes works better */}
                {/* Each to-do item is a ul element!!! */}
    
                {/* SingleTo-Do goes here*/}
              {/* </div>
            </div> */}
    
            <ToDoFilters />
          </div>
        </div>
      </div>
    );
  }
}

	
// const tasks = [
//   { id: 1,
//     content: 'Buy groceries for next week',
//     completed: false,
//   },
//   { id: 2,
//     content: 'Breathing exercises',
//     completed: true,
//   },
// ];


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ToDoList/>);