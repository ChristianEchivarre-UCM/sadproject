// 
//  REGISTRATION
// 
function register() {
  const idnumber = document.getElementById('idnumber').value.trim();
  const name = document.getElementById('name').value.trim();
  const course = document.getElementById('course').value.trim();
  const password = document.getElementById('password').value;

  if (!idnumber || !name || !course || !password) {
    alert('Please fill all required fields.');
    return;
  }

  const existingUser = localStorage.getItem('user');
  if (existingUser) {
    const user = JSON.parse(existingUser);
    if (user.idnumber === idnumber) {
      alert('User with this ID number already exists.');
      return;
    }
  }

  const user = {
    idnumber,
    name,
    course,
    password,
    email: ''
  };

  localStorage.setItem('user', JSON.stringify(user));
  alert('Registration successful!');
  window.location.href = 'login.html';
}

// 
//  LOGIN
// 
function login(event) {
  event.preventDefault();

  const idnumberInput = document.getElementById('idnumber1').value.trim();
  const passwordInput = document.getElementById('password1').value;

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    alert('No user found. Please register first.');
    return;
  }

  if (user.idnumber === idnumberInput && user.password === passwordInput) {
    alert('Login successful!');
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid ID number or password.');
  }
}

//  DASHBOARD

function loadDashboard() {
  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));

  if (!user) {
    alert("Session expired. Please login again.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("studentName").innerHTML = 
    `Welcome, <b>${user.name}</b>!`;

    document.getElementById("course").textContent = 
    `Course: ${user.course}`;
}

//  dashboard numbers
function loadDashboardNumbers() {
  let borrowed = JSON.parse(localStorage.getItem("borrowedItems")) || [];
  let equipment = JSON.parse(localStorage.getItem("equipmentList")) || [];

  document.getElementById("borrowedCount").textContent = borrowed.length;
  document.getElementById("availableCount").textContent = equipment.length;
}

//  user setting
function loadUserSettings() {
  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!user) {
    alert('You are not logged in.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('idnumber1').textContent = user.idnumber;
  document.getElementById('studentName').textContent = user.name;
  document.getElementById('password1').textContent = 
    user.password.replace(/.(?=.{4})/g, '*');
}

//  enable ediit
function enableEdit() {
  const iDSpan = document.getElementById('idnumber1');
  const nameSpan = document.getElementById('studentName');
  const passwordSpan = document.getElementById('password1');

  iDSpan.innerHTML = `<input type="text" id="editId" value="${iDSpan.textContent}">`;
  nameSpan.innerHTML = `<input type="text" id="editName" value="${nameSpan.textContent}">`;
  passwordSpan.innerHTML = `<input type="password" id="editPassword">`;

  const editBtn = document.querySelector('.edit-btn');
  editBtn.textContent = 'Save';
  editBtn.onclick = saveChanges;
}

//save changes
function saveChanges() {
  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!user) return;

  const newID = document.getElementById('editId').value.trim();
  const newName = document.getElementById('editName').value.trim();
  const newPassword = document.getElementById('editPassword').value;

  if (!newID || !newName || !newPassword) {
    alert('Please fill all fields.');
    return;
  }

  user.idnumber = newID;
  user.name = newName;    
  user.password = newPassword;

  sessionStorage.setItem('loggedInUser', JSON.stringify(user));
  localStorage.setItem('user', JSON.stringify(user));

  alert('Changes saved!');
  location.reload();
}

//
//  LOGOUT
function logout() {
  sessionStorage.removeItem('loggedInUser');
  alert('Logged out successfully.');
  window.location.href = 'login.html';
}

// ==============================
// ✅ EQUIPMENT SYSTEM
// ==============================

// ✅ Default equipment (auto-load)
if (!localStorage.getItem("equipmentList")) {
  const defaultEquipment = [
    "Java Programming Book",
    "System Analysis & Design Book",
    "Accounting in IT Book",
  ];
  localStorage.setItem("equipmentList", JSON.stringify(defaultEquipment));
}
//  Borrow Item
function borrowItem(item, index) {
  let borrowed = JSON.parse(localStorage.getItem("borrowedItems")) || [];
  let equipment = JSON.parse(localStorage.getItem("equipmentList")) || [];

  borrowed.push(item);
  equipment.splice(index, 1);

  localStorage.setItem("borrowedItems", JSON.stringify(borrowed));
  localStorage.setItem("equipmentList", JSON.stringify(equipment));

  alert("Borrowed successfully!");
  loadAvailableEquipment(); 
  loadDashboardNumbers();  
}
//  diri mo display ang mga gi borrow sa user 
function loadBorrowedPage() {
  const list = document.getElementById("borrowedList");
  if (!list) return;

  let borrowed = JSON.parse(localStorage.getItem("borrowedItems")) || [];

  list.innerHTML = "";

  if (borrowed.length === 0) {
    list.innerHTML = "<p class='empty'>No borrowed items yet.</p>";
    return;
  }

  borrowed.forEach((item, index) => {
    list.innerHTML += `
      <div class="item">
        <span>${item}</span>
        <button onclick="returnItem('${item}', ${index})">Return</button>
      </div>
    `;
  });
}
function loadAvailableEquipment() {
  const container = document.getElementById("equipmentList");
  if (!container) return;

  let equipment = JSON.parse(localStorage.getItem("equipmentList")) || [];

  container.innerHTML = "";

  if (equipment.length === 0) {
    container.innerHTML = "<p>No available equipment.</p>";
    return;
  }

  equipment.forEach((item, index) => {
    container.innerHTML += `
      <div class="item">
        <span>${item}</span>
        <button onclick="borrowItem('${item}', ${index})">Borrow</button>
      </div>
    `;
  });
}


// ✅ Return Item
function returnItem(item, index) {
  let borrowed = JSON.parse(localStorage.getItem("borrowedItems")) || [];
  let equipment = JSON.parse(localStorage.getItem("equipmentList")) || [];

  equipment.push(item);
  borrowed.splice(index, 1);

  localStorage.setItem("borrowedItems", JSON.stringify(borrowed));
  localStorage.setItem("equipmentList", JSON.stringify(equipment));

  alert("Returned successfully!");
  window.location.href = "dashboard.html";
}

// page detection
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  if (path.includes("dashboard.html")) {
    loadDashboard();
    loadDashboardNumbers();
  }

  if (path.includes("setting.html")) {
    loadUserSettings();
  } 
  if (path.includes("borrowed.html")) {
    loadBorrowedPage(); 
  }
  if (path.includes("available.html")) {
  loadAvailableEquipment();
}
});
