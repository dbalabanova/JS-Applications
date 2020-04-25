import { get,post, put,del } from "./requester.js";

const html = {
 "getAllBooks": ()=> document.getElementById('allBooks'),
 'createTitle': ()=> document.getElementById('title'),
 'createAuthor': ()=> document.getElementById('author'),
 'createIsbn': ()=> document.getElementById('isbn'),
 'editTitle': ()=>document.getElementById('editTitle'),
 'editAuthor': ()=> document.getElementById('editAuthor'),
 'editIsbn': ()=> document.getElementById('editIsbn'),
 'getEditId': ()=> document.getElementById('editId')
}
const actions = {
  'loadBooks': async function() {
    try {
      const books = await get("appdata", "books");
     //console.log(books)
      const booksContainer = html.getAllBooks();
      const fragment = document.createDocumentFragment()

      books.forEach((book)=>{
      const tr = document.createElement('tr');
      const tdTitle = document.createElement('td');
      const tdAuthor = document.createElement('td');
      const tdIsbn = document.createElement('td');
      const tdActionButns = document.createElement('td');

      tdTitle.textContent=book.title;
      tdAuthor.textContent=book.author;
      tdIsbn.textContent=book.isbn;

      const editBtn =document.createElement('button')
      const deleteBtn =document.createElement('button')

      editBtn.textContent = 'Edit';
      editBtn.id=book._id
      editBtn.addEventListener('click', this['editBookGet'])

      deleteBtn.textContent="Delete"
      deleteBtn.id=book._id
      deleteBtn.addEventListener('click', this['deleteBook']);

      tdActionButns.appendChild(editBtn);
      tdActionButns.appendChild(deleteBtn);
      tr.append(tdTitle,tdAuthor,tdIsbn,tdActionButns);
    
      fragment.appendChild(tr);
     })
     booksContainer.innerHTML="";
     booksContainer.appendChild(fragment)
    } catch (err) {
      alert(err);
    }
  },
  'createBook': async function() {
    const title= html.createTitle()
    const author= html.createAuthor()
    const isbn= html.createIsbn()

    if(title!==null && author!==null && isbn!==null){
      const data = {
        title: title.value,
        author: author.value,
        isbn: isbn.value
      }
   
   try{
    await post('appdata','books',data)
     title.value='';
     author.value='';
     isbn.value='';
   actions['loadBooks']()
   } catch(err){
     alert(err)
   }
  }
  },
  'editBookGet': async function () {
    const theId = this.id;
    try {
      const singleBook = await get('appdata',`books/${theId}`)
      
      const id  = html.getEditId()
      const title = html.editTitle();
      const author = html.editAuthor();
      const isbn = html.editIsbn();

      title.value = singleBook.title;
      author.value = singleBook.author;
      isbn.value = singleBook.isbn;
      id.value = singleBook._id
      
    } catch(err) {
        alert(err)
    }

  },
  'editBookPost': async function () {
    //console.log('yes')
    const id  = html.getEditId()
    const title = html.editTitle();
    const author = html.editAuthor();
    const isbn = html.editIsbn();
    console.log(id.value)
    if(title!==null && author!==null && isbn!==null){
    const data = {
      title: title.value,
      author: author.value,
      isbn: isbn.value
    }
    try{
      const modifiedBook = await put('appdata',`books/${id.value}`,data)
      title.value='';
      author.value='';
      isbn.value='';
      id.value = '';

  actions['loadBooks']();

    }catch(err){
      alert(err)
    }
  }
  },
  deleteBook: async function () {
    if(confirm('Are you sure?')){
      const id = this.id;

      try{
        const deletedEntities = await del('appdata',`books/${id}`)
        actions['loadBooks']();
      }catch(err){
        alert(err)
      }
    }
    
  }
};
function handleEvent(e) {
  if (typeof actions[e.target.id] === "function") {
    e.preventDefault()
    actions[e.target.id]();
  }
}
(function attachEvents() {
  document.addEventListener("click", handleEvent);
})();
