import "./App.css";
import { useState, useEffect } from "react";

function Card(props) {
  const [inputs, setInputs] = useState(props.item || {});
  const [isDetailOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    props.onUpdate(props.index, inputs);
    setIsOpen(false);
  };

  const onSelect = (event) => {
    const value = event.target.checked;
    if (value) {
      props.onSelected(inputs.id);
    } else {
      props.onRemoveSelected(inputs.id);
    }
  };

  const onRemove = () => {
    props.onRemove(inputs.id);
  };

  return (
    <div className="box">
      <div className="box-title">
        <input type="checkbox" onChange={onSelect}></input>
        <span>{inputs.title}</span>

        <button onClick={() => setIsOpen(!isDetailOpen)}>Detail</button>
        <button onClick={onRemove}>Remove</button>
      </div>
      <form
        style={{
          padding: "16px",
          display: `${isDetailOpen ? "block" : "none"}`,
        }}
      >
        <div className="left">
          <input
            type="text"
            placeholder="Add new task...."
            onChange={handleChange}
            name="title"
            value={inputs.title || ""}
          />

          <div className="left-2">
            <h5>Description</h5>
          </div>
          <textarea
            onChange={handleChange}
            name="description"
            value={inputs.description || ""}
          />

          <div className="left-3">
            <div className="due-date">
              <h5>Due date</h5>
              <input
                type="date"
                name="dueDate"
                onChange={handleChange}
                value={inputs.dueDate || ""}
              ></input>
            </div>
            <div className="piority">
              <h5>Piority</h5>
              <select
                onChange={handleChange}
                name="piority"
                value={inputs.piority || "Low"}
                defaultValue={"Low"}
              >
                <option value={"Low"}>Low</option>
                <option value={"Normal"}>Normal</option>
                <option value={"High"}>High</option>
              </select>
            </div>
          </div>
          <button onClick={onSubmit} className="left-add">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [inputs, setInputs] = useState({
    dueDate: new Date().toLocaleDateString("en-CA"),
    piority: "Normal",
  });
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState();

  const onRemoveAll = () => {
    const newList = [];
    list.forEach((e, _) => {
      if (!selected.includes(e.id)) {
        newList.push(e);
      }
    });
    setSelected([]);
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!inputs.title) {
      alert("Please select a title");
      return;
    }
    const newList = [...list, { ...inputs, id: new Date().getTime() }];
    localStorage.setItem("list", JSON.stringify(newList));
    setList(newList);
    setInputs({});
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const onSelected = (id) => {
    setSelected((prevSelected) => [...prevSelected, id]);
  };

  const onRemoveSelected = (id) => {
    setSelected((prevSelected) => prevSelected.filter((item) => item !== id));
  };

  const onRemove = (id) => {
    const newList = list.filter((item) => item.id !== id);
    localStorage.setItem("list", JSON.stringify(newList));
    setList(newList);
  };

  const onUpdate = (index, newValues) => {
    const newList = [...list];
    newList[index] = newValues;
    localStorage.setItem("list", JSON.stringify(newList));
    setList(newList);
    console.log(newValues);
  };

  useEffect(() => {
    const storedList = localStorage.getItem("list");
    if (storedList) {
      setList(JSON.parse(storedList));
    }
  }, []);

  useEffect(() => {
    const storedList = localStorage.getItem("list");
    if (storedList) {
      const items = JSON.parse(storedList);
      if (search) {
        const itemFilters = items.filter((e) => e.title.indexOf(search) > -1);
        setList(itemFilters);
      } else {
        setList(items);
      }
    }
  }, [search]);

  return (
    <div className="App">
      <div className="left">
        <h1>New Task</h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Add new task...."
            onChange={handleChange}
            name="title"
            value={inputs.title || ""}
          />

          <div className="left-2">
            <h5>Description</h5>
          </div>
          <textarea
            onChange={handleChange}
            name="description"
            value={inputs.description || ""}
          />

          <div className="left-3">
            <div className="due-date">
              <h5>Due date</h5>
              <input
                type="date"
                name="dueDate"
                onChange={handleChange}
                value={inputs.dueDate || new Date().toLocaleDateString("en-CA")}
                min={new Date().toLocaleDateString("en-CA")}
              ></input>
            </div>
            <div className="piority">
              <h5>Piority</h5>
              <select
                onChange={handleChange}
                name="piority"
                value={inputs.piority || "Normal"}
              >
                <option value={"High"}>High</option>
                <option value={"Normal"}>Normal</option>
                <option value={"Low"}>Low</option>
              </select>
            </div>
          </div>
          <button type="submit" className="left-add">
            Add
          </button>
        </form>
      </div>
      <div className="right">
        <h1>ToDo List</h1>
        <input
          style={{ width: "100%" }}
          type="text"
          placeholder="Search...."
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="app">
          {list.map((e, index) => (
            <Card
              item={e}
              onRemove={onRemove}
              onUpdate={onUpdate}
              onSelected={onSelected}
              onRemoveSelected={onRemoveSelected}
              index={index}
              key={e.id}
            ></Card>
          ))}
        </div>
        <div className="line-last">
          <button>Done</button>
          <button onClick={onRemoveAll}>Remove</button>
        </div>
      </div>
    </div>
  );
}

export default App;
