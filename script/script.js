const taskInputEl = document.getElementById("todo-inputs");
const taskOutputEl = document.getElementById("tasks");
const filters = document.querySelectorAll(".edit-options p");
const clearEl = document.getElementById("btn-clear");

let todos = JSON.parse(localStorage.getItem("todo-list"));
let editId;
let isEditing = false;

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = document.querySelector(".options.active");
    filter.classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status === "completed" ? "checked" : "";
      if (filter === todo.status || filter === "all") {
        li += `<li class="task-items">
        <div class="input-task">
             <label class="container">
               <input onclick='updateStatus(this)' type="checkbox" id='${id}' ${isCompleted} />
               <div class="checkmark"></div>
             </label>
             <label for="${id}" class="todo ${isCompleted}"
               >${todo.name}</label>
        </div>
        <div class="setting">
          <i onclick='showMenu(this)' class="fa-solid fa-ellipsis-vertical del-icon"></i>
          <ul class="task-menu">
            <li id="task-del" onclick="editTask(${id},'${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
            <li id="task-edit" onclick='deleteTask(${id})'><i class="fa-solid fa-trash"></i>Delete</li>
          </ul>
        </div>
        </li>`;
      }
    });
  }

  taskOutputEl.innerHTML = li || `<span>You don't have any task here...</span>`;
}
showTodo("all");

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function showMenu(selectedMenu) {
  let taskMenu = selectedMenu.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName !== "I" || e.target !== selectedMenu) {
      taskMenu.classList.remove("show");
    }
  });
}

function deleteTask(deleteId) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));

  filters.forEach((filter) => {
    let active = filter.classList.contains("active");
    if (active) {
      showTodo(filter.id);
    }
  });
}

function editTask(taskId, taskName) {
  editId = taskId;
  taskInputEl.value = taskName;
  isEditing = true;
}

taskInputEl.addEventListener("keyup", (e) => {
  let userTaskInput = taskInputEl.value.trim();
  if (e.key === "Enter" && userTaskInput) {
    if (!isEditing) {
      if (!todos) {
        todos = [];
      }
      let taskInfo = {
        name: userTaskInput,
        status: "pending",
      };

      filters.forEach((btn) => {
        btn.classList.remove("active");
        document.getElementById("all").classList.add("active");
      });
      todos.push(taskInfo);
      showTodo("all");
    } else {
      isEditing = false;
      todos[editId].name = userTaskInput;

      filters.forEach((filter) => {
        let active = filter.classList.contains("active");
        if (active) {
          showTodo(filter.id);
        }
      });
    }
    taskInputEl.value = "";

    localStorage.setItem("todo-list", JSON.stringify(todos));
  }
});

clearEl.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  filters.forEach((btn) => {
    btn.classList.remove("active");
    document.getElementById("all").classList.add("active");
  });
  showTodo("all");
});
