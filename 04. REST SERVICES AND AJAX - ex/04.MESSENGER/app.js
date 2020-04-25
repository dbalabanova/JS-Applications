function attachEvents() {
const sendBtn = document.getElementById('submit');
const refreshBtn = document.getElementById('refresh');
const messages = document.getElementById('messages');
const name = document.getElementById('author');
const message = document.getElementById('content');
let arrMessages=[];
sendBtn.addEventListener('click',addMessage);
function addMessage(){
    let author = name.value;
    let content = message.value;
    const headers = {
        method: "POST",
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({author, content})
    }
    fetch('https://rest-messanger.firebaseio.com/messanger.json',headers)
    .then(res=>res.json)
    .then(()=>{
        name.value='';
        message.value='';
    })
    .catch(hanleError)
}
refreshBtn.addEventListener('click', showMessages);
function showMessages() {
    fetch('https://rest-messanger.firebaseio.com/messanger.json')
    .then(res=>res.json())
    .then(data=> {
        let info = Object.values(data);
        for (let current of info) {
            let{author,content}=current
            arrMessages.push(`${author}: ${content}`)
        }
       
    messages.textContent=`${arrMessages.join('\n')}`
        
    })
    .catch(hanleError)

}
function hanleError(){
 alert('Something is not correct')
}
}

attachEvents();