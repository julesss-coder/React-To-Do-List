function ToDoList(props) {
  return (
    <div className="container">
      <div className="row to-do-list">
        <div className="col-12">
          <h1 className="text-center">To-Do-List</h1>

          {/* To-Do Input */}
          <div className="row to-do-input">
            <div className="col-12">
              <div className="input-group mb-3">
                <div className="input-group-text">
                  <input className="form-check-input mt-0 toggleAll" type="checkbox" value="" aria-label="Checkbox for following text input" />
                </div>
                <input type="text" className="form-control" aria-label="Text input with checkbox" placeholder="Your new todo" />
                <button className="btn btn-outline-secondary addTo-Do-Button" type="button" id="button-addon2">Add to-do</button>
              </div>
            </div>
          </div>

          {/* To-Do List */}
          <div className="row rendered-to-dos">
            <div className="col-12">
              {/* className="list-group: Checkbox, to-do and button not aligned. Cannot access todo separately.  */}
              {/* To-do List as Table - works, but button is not center aligned. Try with flexbox.*/}
              {/* Another approach:  URL: https://mdbootstrap.com/docs/standard/extended/to-do-list/,*/}
              {/* I don't have to layout everything with rol and col, using flexbox on individual divs sometimes works better */}
              {/* Each to-do item is a ul element!!! */}
              <ul className="list-group list-group-horizontal rounded-0 bg-transparent">
                <li
                  className="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                  <div className="form-check">
                    <input className="form-check-input me-0" type="checkbox" value="" id="flexCheckChecked1"
                      aria-label="..." />
                  </div>
                </li>
                <li className="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                  <p className="lead fw-normal mb-0">Buy groceries for next week</p>
                  {/* When editing to-do item, replace above p element with the following input element: */}
                  {/* <input className="me-0" type="text" /> */}
                </li>
                <li className="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                  <button className="btn btn-danger">Remove</button>
                </li>
              </ul>  

              {/* Each to-do item is a ul element!!! */}
              <ul className="list-group list-group-horizontal rounded-0 bg-transparent">
                <li
                  className="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                  <div className="form-check">
                    <input className="form-check-input me-0" type="checkbox" value="" id="flexCheckChecked1"
                      aria-label="..." />
                  </div>
                </li>
                <li className="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                  <p className="lead fw-normal mb-0">Buy groceries for next week</p>
                  {/* When editing to-do item, replace above p element with the following input element: */}
                  {/* <input className="me-0" type="text" /> */}
                </li>
                <li className="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                  <button className="btn btn-danger">Remove</button>
                </li>
              </ul>  
            </div>
          </div>

          {/* To-Do Filters */}
          <div className="row to-do-filters">
            <div className="col-12">
              <div className="filter-buttons d-flex flex-row justify-content-center mt-4">
                <button type="button" className="btn btn-primary mx-2 active" data-bs-toggle="button" autoComplete="off" aria-pressed="true">All to-dos button</button>
                <button type="button" className="btn btn-primary mx-2" data-bs-toggle="button" autoComplete="off">Active to-dos</button>
                <button type="button" className="btn btn-primary mx-2" data-bs-toggle="button" autoComplete="off">Completed to-dos</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ToDoList />);