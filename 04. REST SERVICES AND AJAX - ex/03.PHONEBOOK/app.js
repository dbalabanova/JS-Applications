function attachEvents() {
  const loadBtn = document.getElementById("btnLoad");
  const createBtn = document.getElementById("btnCreate");
  const personField = document.getElementById("person");
  const phoneField = document.getElementById("phone");
  const phonebookList = document.getElementById("phonebook");
  let urlGetPost = `https://phonebook-nakov.firebaseio.com/phonebook.json`;

  loadBtn.addEventListener("click", loadContacts);

  function loadContacts() {
    fetch(urlGetPost)
      .then(res => res.json())
      .then(data => {
        let info = Object.entries(data);
        for (let currPerson of info) {
          let [key, obj] = currPerson;
          let { person, phone } = obj;
          let deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete";
          deleteBtn.setAttribute("id", key);
          let li = document.createElement("li");
          li.textContent = `${person}: ${phone}`;
          li.appendChild(deleteBtn);
          phonebookList.appendChild(li);

          deleteBtn.addEventListener("click", deleteFromPhoneBook);
        }
      })
      .catch(handleError);
  }

  function deleteFromPhoneBook(e) {
    let key = e.target.id;
  
    const headers = {
        method: "DELETE"
    }
    fetch(`https://phonebook-nakov.firebaseio.com/phonebook/${key}.json`,headers)
      .then(res => res.json())
      .then(() => {
        phonebookList.innerHTML='';
        loadContacts();
      })
      .catch(handleError);
      
  }

  createBtn.addEventListener("click", createNewPhonebook);
  function createNewPhonebook() {
    phonebookList.innerHTML='';
    let person = personField.value;
    let phone = phoneField.value;
    const headers ={
        method: "post",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({person,phone})
    }
    fetch(`https://phonebook-nakov.firebaseio.com/phonebook.json`,headers)
    .then(res=>res.json())
    .then(()=>{
        personField.value='';
        phoneField.value='';

        loadContacts();
    })
    .catch(handleError)
  }

  function hanleError(){
    alert('Something is not correct')
   }
}

attachEvents();
