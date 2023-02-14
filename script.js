/* 
New API as of September 2022: https://fewd-todolist-api.onrender.com/
New id: {success:true,id:111}
*/

function Loader(props) {
  return (
    <div className="d-flex justify-content-center m-5 p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

function ToDoFilters(props) {
  let {changeFilter, todosLength} = props;

  return (
    <div className="row to-do-filters">
      <div className="col-12">
        { todosLength === 0 
          ? 'There are no to-dos.'
          : <div className="filter-buttons d-flex flex-row justify-content-center mt-4">
            <button onClick={() => changeFilter('show-all-todos')} type="button" className="btn btn-primary mx-2 filter-button show-all-todos active" data-bs-toggle="button" autoComplete="off" aria-pressed="true">All to-dos</button>
            <button onClick={() => changeFilter('show-active-todos')} type="button" className="btn btn-primary mx-2 filter-button show-active-todos" data-bs-toggle="button" autoComplete="off">Active to-dos</button>
            <button onClick={() => changeFilter('show-completed-todos')} type="button" className="btn btn-primary mx-2 filter-button show-completed-todos" data-bs-toggle="button" autoComplete="off">Completed to-dos</button>
          </div>
        }
      </div>
    </div>
  )
}

function RenderToDos(props) {
  const {todos, onRemove, onToggle, onEdit, onEditSubmit, onBlur, filterStatus} = props;
  let currentTodos;

  // render todos based on filterStatus
  if (filterStatus === 'show-active-todos') {
    currentTodos = todos.filter(todo => {
      return todo.completed === false;
    });
  } else if (filterStatus === 'show-completed-todos') {
    currentTodos = todos.filter(todo => {
      return todo.completed === true;
    });
  } else {
    currentTodos = todos;
  }

  return (
    <div className="row rendered-to-dos">
      <div className="col-12">
        { currentTodos.map((todo) => {
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
                  <p onDoubleClick={onEdit} className="lead fw-normal mb-0">{todo.content}</p>
                  {/* When editing to-do item, replace above p element with the following input element: */}
                  <input onKeyUp={onEditSubmit} onBlur={onBlur} className="me-0 edit-input editing" type="text" defaultValue={todo.content} />
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
    let {todos, onSubmit, onToggleAll, onEnterKey} = this.props;

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
              /* If there are todos:
                   If all todos are completed:
                     Toggle-all checkbox is checked
                   Else:
                     Toggle-all checkbox is not checked
                 Else if there are no todos:
                   Toggle-all checkbox is not checked
              */
              checked={
                todos.length > 0
                ?             
                  todos.every(todo => {
                    return todo.completed; 
                  }) 
                  ? 'checked' 
                  : ''
                : ''
              } 
              />
            </div>
            <input onChange={this.handleInput} onKeyUp={onEnterKey} type="text" className="form-control" aria-label="Text input with checkbox" placeholder="Your new to-do" />
            <button onClick={onSubmit} className="btn btn-outline-secondary addTo-Do-Button" type="button" id="button-addon2">Add to-do</button>
          </div>
        </div>
      </div>
    );
  }
}

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      filterStatus: 'show-all-todos',
      loading: false,
    };

    this.fetchTodos = this.fetchTodos.bind(this);
    this.addToDo = this.addToDo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.checkTodoStatus = this.checkTodoStatus.bind(this);
    this.toggleTodo = this.toggleTodo.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.fetchTodos();
  }
  
  fetchTodos() {
    if (this.state.loading === false) {
      this.setState({
        loading: true,
      });
    }

    fetch('https://fewd-todolist-api.onrender.com/tasks?api_key=111').then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then(data => {
      this.setState({
        todos: data.tasks,
        loading: false,
      });
    }).catch(error => {
      console.log(error);
    });
  }


  addToDo(toDo) {
    this.setState({
      loading: true,
    });
    
    fetch('https://fewd-todolist-api.onrender.com/tasks?api_key=111', {
      method: 'POST',
      mode: 'cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: {
          content: toDo,
        }
      }),
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then(data => {
      this.fetchTodos();
    }).catch(error => {
      console.log(error);
    });
  }

  
  handleSubmit(e) {
    if (e.target.nodeName === 'INPUT' && e.key === "Enter") {
      if (!e.target.value.trim()) {
        return;
      }

      let todo = e.target.value.trim();
      this.addToDo(todo);

    } else if (e.target.nodeName === 'BUTTON' && e.type === 'click') {
      if (!e.target.previousElementSibling.value.trim()) {
        return;
      }

      let todo = e.target.previousElementSibling.value.trim();
      this.addToDo(todo);
    }
  }


  handleRemove() {
    let todoId = +event.target.closest('ul').getAttribute('dataid');
    if(!todoId) {
      return;
    }

    this.setState({
      loading: true,
    });

    fetch(`https://fewd-todolist-api.onrender.com/tasks/${todoId}?api_key=111`, {
      method: 'DELETE',
      mode: 'cors',
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then(data => {
      this.fetchTodos();
    }).catch(error => {
      console.log(error);
    });
  }


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
          this.toggleTodo('mark_complete', todo.id);
        } else {
          this.toggleTodo('mark_active', todo.id);
        }
      }
    });
  }

  toggleTodo(toggleAction, todoId) {
    this.setState({
      loading: true,
    });

    fetch(`https://fewd-todolist-api.onrender.com/tasks/${+todoId}/${toggleAction}?api_key=111`, {
      method: 'PUT', 
      mode: 'cors',
    }).then(response => {
      if (response.ok) {
        return response.json();
      }

      throw new Error('Request was either a 404 or 500');
    }).then(data => {
      this.fetchTodos();
    }).catch(error => {
      console.log(error);
    });  
  }


  toggleAll() {
    // If toggle-all checkbox is checked/not checked AFTER USER CLICKS ON IT - DOES NOT REFER TO ITS STATE BEFORE THE CLICK!!!
    if (event.target.checked === false) {      
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

      activeTodos.forEach(todo => {
        this.toggleTodo('mark_complete', todo.id);
      });
    }
  }


  handleEdit(e) {
    // I am using the React event `e` this time, instead of JS event `event`
    let iDToEdit = e.target.closest('ul').getAttribute('dataid');
    // Hide todo item
    e.target.classList.add('editing');
    // Display editing field instead of todo
    let editInputField = e.target.nextElementSibling;
    editInputField.classList.remove('editing');
    editInputField.value = e.target.textContent;
    editInputField.focus();
  }

  handleEditSubmit(e) {
    if (!e.target.value.trim()) {
      return;
    }

    let iDToEdit = +e.target.closest('ul').getAttribute('dataid');
    let editedToDo = e.target.value.trim();

    if (e.key === "Enter") {
      fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${iDToEdit}?api_key=111`, {
        method: 'PUT',
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: {
            content: editedToDo,
          }
        }),
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request was either a 404 or 500');
      }).then(data => {
        this.fetchTodos();
      }).catch(error => {
        console.log(error);
        // Hiding input and displaying todo is not necessary after a successful fetch request. However, it IS necessary after an error is thrown, as in that case, fetchTodos is not called, so the DOM is not rerendered. -> Input field stays visible, the p element of the todo item is not.
        // Hide input field
        e.target.classList.add('editing');
        // Display todo item
        e.target.previousElementSibling.classList.remove('editing');
      });
    } else if (e.key === "Escape") {
      // Hide input field
      e.target.classList.add('editing');
      // Display todo item
      e.target.previousElementSibling.classList.remove('editing');
    }
  }

  /* ======== HANDLE CLICK OUTSIDE EDIT INPUT FIELD WHEN EDITING ===== */

  handleOutsideClick(e) {
    // Hide edit-input field
    e.target.classList.add('editing');
    // Display todo item
    e.target.previousElementSibling.classList.remove('editing');
  }


  handleFilterChange(filter) {
    let filterButtons = document.getElementsByClassName('filter-button');
    for (let i = 0; i < filterButtons.length; i++) {
      if (filterButtons[i].classList.contains(filter)) {
        filterButtons[i].classList.add('active');
      } else {
        filterButtons[i].classList.remove('active');
      }
    }

    this.setState({
      filterStatus: filter,
    });
  }


  render() {
    if (this.state.loading === true) return <Loader />

    const {todos} = this.state;

    return (
      <div className="container">
        <div className="row to-do-list">
          <div className="col-12">
            <h1 className="text-center my-5">To-Do-List</h1>
    
            <ToDoInput todos={this.state.todos} onSubmit={(e) => this.handleSubmit(e)} onEnterKey={(e) => this.handleSubmit(e)} onToggleAll={this.toggleAll}/>
    
            <RenderToDos todos={todos} onRemove={this.handleRemove} onToggle={this.checkTodoStatus} onEdit={(e) => this.handleEdit(e)} onEditSubmit={(e) => this.handleEditSubmit(e)} onBlur={(e) => this.handleOutsideClick(e)} filterStatus={this.state.filterStatus}/>
    
            <ToDoFilters changeFilter={this.handleFilterChange} todosLength={this.state.todos.length}/>
          </div>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ToDoList/>);