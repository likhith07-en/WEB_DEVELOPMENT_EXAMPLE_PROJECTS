    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');
    const taskList = document.getElementById('taskList');
    const errorMsg = document.getElementById('errorMsg');

    // Load tasks from local storage
    window.onload = function() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => renderTask(task));
    };

    function addTask() {
      const text = taskInput.value.trim();
      const date = taskDate.value;
      const time = taskTime.value;

      if (text === '' || date === '' || time === '') {
        showError("All fields are required!");
        return;
      }

      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const duplicate = tasks.some(t => t.text === text && t.date === date && t.time === time);

      if (duplicate) {
        showError("Task with same name, date & time already exists!");
        return;
      }

      const task = { text, date, time, completed: false };
      renderTask(task);
      saveTask(task);

      // Clear inputs
      taskInput.value = '';
      taskDate.value = '';
      taskTime.value = '';
      errorMsg.textContent = '';
    }

    function renderTask(task) {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      const deadline = document.createElement('div');
      deadline.className = 'deadline';
      deadline.textContent = `Due: ${task.date} ${task.time}`;

      const actions = document.createElement('div');
      actions.className = 'actions';

      const completeBtn = document.createElement('button');
      completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
      completeBtn.onclick = () => toggleComplete(task, li, completeBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => deleteTask(task, li);

      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(span);
      li.appendChild(deadline);
      li.appendChild(actions);

      taskList.appendChild(li);
    }

    function saveTask(task) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateStorage(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function toggleComplete(task, li, btn) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const index = tasks.findIndex(t => t.text === task.text && t.date === task.date && t.time === task.time);
      tasks[index].completed = !tasks[index].completed;
      updateStorage(tasks);

      li.classList.toggle('completed');
      btn.textContent = tasks[index].completed ? 'Undo' : 'Complete';
    }

    function deleteTask(task, li) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks = tasks.filter(t => !(t.text === task.text && t.date === task.date && t.time === task.time));
      updateStorage(tasks);
      li.remove();
    }

    function showError(message) {
      errorMsg.textContent = message;
    }
