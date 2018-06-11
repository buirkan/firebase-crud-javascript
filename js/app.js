var config = {
	apiKey: "",
	authDomain: "",
	databaseURL: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: ""
  };

firebase.initializeApp(config);

const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');

readUserData(); 
	
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Função que lista todos os usuários do banco de dados;
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
function readUserData() {
	const userListUI = document.getElementById("user-list");

	usersRef.on("value", snap => {

		userListUI.innerHTML = ""

		snap.forEach(childSnap => {

			let key = childSnap.key,
				value = childSnap.val()
  			
			let $li = document.createElement("li");

			let editIconUI = document.createElement("span");
			editIconUI.class = "edit-user";
			editIconUI.innerHTML = " ✎";
			editIconUI.setAttribute("userid", key);
			editIconUI.addEventListener("click", editButtonClicked)

			let deleteIconUI = document.createElement("span");
			deleteIconUI.class = "delete-user";
			deleteIconUI.innerHTML = " ☓";
			deleteIconUI.setAttribute("userid", key);
			deleteIconUI.addEventListener("click", deleteButtonClicked)
			
			$li.innerHTML = value.name;
			$li.append(editIconUI);
			$li.append(deleteIconUI);

			$li.setAttribute("user-key", key);
			$li.addEventListener("click", userClicked)
			userListUI.append($li);
 		});
	})
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Função que retorna os dados do usuário selecionado;
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
function userClicked(e) {
		var userID = e.target.getAttribute("user-key");

		const userRef = dbRef.child('users/' + userID);
		const userDetailUI = document.getElementById("user-detail");

		userRef.on("value", snap => {

			userDetailUI.innerHTML = ""

			snap.forEach(childSnap => {
				var $p = document.createElement("p");
				var currentField = childSnap.key;

				if(currentField == 'name'){
					currentField = 'Nome';
				} else if (currentField == 'age'){
					currentField = 'Idade';
				} else {
					currentField = 'E-mail';
				}

				$p.innerHTML = currentField  + " - " +  childSnap.val();
				userDetailUI.append($p);
			})
		});
}

const addUserBtnUI = document.getElementById("add-user-btn");
addUserBtnUI.addEventListener("click", addUserBtnClicked)

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Função que adiciona novo usuário ao banco de dados;
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
function addUserBtnClicked() {
	const usersRef = dbRef.child('users');
	const addUserInputsUI = document.getElementsByClassName("user-input");

 	let newUser = {};

    for (let i = 0, len = addUserInputsUI.length; i < len; i++) {
        let key = addUserInputsUI[i].getAttribute('data-key');
		let value = addUserInputsUI[i].value;
		addUserInputsUI[i].value = "";
        newUser[key] = value;
	}
	
	usersRef.push(newUser)
 
	alert('Usuário adicionado com sucesso!');
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Função que deleta usuário do banco de dados;
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
function deleteButtonClicked(e) {
		e.stopPropagation();

		var userID = e.target.getAttribute("userid");

		const userRef = dbRef.child('users/' + userID);
		
		userRef.remove();
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Função que edita o usuário do banco de dados;
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
function editButtonClicked(e) {
	document.getElementById('edit-user-module').style.display = "block";
	document.querySelector(".edit-userid").value = e.target.getAttribute("userid");

	const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));
	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	userRef.on("value", snap => {
		for(var i = 0, len = editUserInputsUI.length; i < len; i++) {
			var key = editUserInputsUI[i].getAttribute("data-key");
					editUserInputsUI[i].value = snap.val()[key];
		}
	});
	const saveBtn = document.querySelector("#edit-user-btn");

	saveBtn.addEventListener("click", saveUserBtnClicked)
}

function saveUserBtnClicked(e) {
	const userID = document.querySelector(".edit-userid").value;
	const userRef = dbRef.child('users/' + userID);

	var editedUserObject = {}

	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	editUserInputsUI.forEach(function(textField) {
		let key = textField.getAttribute("data-key");
		let value = textField.value;
  		editedUserObject[textField.getAttribute("data-key")] = textField.value
	});

	userRef.update(editedUserObject);

	alert('Usuário alterado com sucesso!');
	document.getElementById('edit-user-module').style.display = "none";
}