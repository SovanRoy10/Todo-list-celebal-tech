import { useState, useEffect } from "react";
import { Todoprovider } from "./context";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState("asc");

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  };

  const updateTodo = (id, todo) => {
    setTodos((prev) =>
      prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo
      )
    );
  };

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    if (todos && todos.length > 0) {
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Filter tasks based on the current filter state
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true;
  });

  // Reverse tasks based on the current order state
  const displayedTodos = order === "desc" ? [...filteredTodos].reverse() : filteredTodos;

  return (
    <Todoprovider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}
    >
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">
            Manage Your Todos
          </h1>
          <div className="mb-4">
            <TodoForm />
          </div>
          <div className="flex justify-evenly mb-4">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="bg-blue-300/10 hover:bg-blue-400/10 px-4 py-2 rounded-md"
            >
              <option value="asc" className="text-black">Asc</option>
              <option value="desc" className="text-black">Desc</option>
            </select>

            <button
              onClick={() => setFilter("all")}
              className={`bg-blue-300/10 hover:bg-blue-400/10 px-4 py-2 rounded-md ${
                filter === "all" && "border-2 border-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`bg-blue-300/10 hover:bg-blue-400/10 px-4 py-2 rounded-md ${
                filter === "completed" && "border-2 border-white"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("incomplete")}
              className={`bg-blue-300/10 hover:bg-blue-400/10 px-4 py-2 rounded-md ${
                filter === "incomplete" && "border-2 border-white"
              }`}
            >
              Incomplete
            </button>
          </div>
          <div className="flex flex-wrap gap-y-3">
            {displayedTodos.map((todo) => (
              <div key={todo.id} className="w-full">
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Todoprovider>
  );
}

export default App;
