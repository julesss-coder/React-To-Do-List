/* 
TODOS
Only add a todo if input field is not empty
Otherwise, adding todos appears to work

NEXT: 
Remove todo
Toggle a todo
toggle all
Filter todos
Toggle all todos
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
  const {todos} = props;

  return (
    <div className="row rendered-to-dos">
      <div className="col-12">
        { todos.map((todo) => {
            return (
              <ul className="list-group list-group-horizontal rounded-0 bg-transparent" key={todo.id}>
                <li
                  className="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                  <div className="form-check">
                    <input className="form-check-input me-0" type="checkbox" value="" id="flexCheckChecked1"
                      aria-label="..." checked={todo.completed ? 'checked' : ''}/>
                  </div>
                </li>
                <li className="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                  <p className="lead fw-normal mb-0">{todo.content}</p>
                  {/* When editing to-do item, replace above p element with the following input element: */}
                  {/* <input className="me-0" type="text" /> */}
                </li>
                <li className="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                  <button className="btn btn-danger">Remove</button>
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
    let {onSubmit} = this.props;

    console.log('this.state inside ToDoInput: ', this.state);
    return (
      <div className="row to-do-input">
        <div className="col-12">
          <div className="input-group mb-3">
            <div className="input-group-text">
              <input className="form-check-input mt-0 toggleAll" type="checkbox" value="" aria-label="Checkbox for following text input" />
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

  // Why does the POST request look so different in Altcademy's version? ->
  // .then(checkStatus)
  //     .then(json)
  //     .then((data) => {
  //       this.setState({new_task: ''});
  //       this.fetchTasks();
  //     })
  handleSubmit() {
    // console.log(event.target.previousElementSibling.value);
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

  render() {

    /* How to request todos? 
     * function that makes request and changes this.state.todos
    */
    const {todos} = this.state;
    console.log('state in render(): ', this.state);

    return (
      <div className="container">
        <div className="row to-do-list">
          <div className="col-12">
            <h1 className="text-center">To-Do-List</h1>
    
            <ToDoInput todos={todos} onSubmit={this.handleSubmit}/>
    
            <RenderToDos todos={todos}/>
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