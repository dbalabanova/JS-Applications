function show(e) {
 
  const infoBtn = document.getElementsByClassName("info")[0];
  const container = document.getElementById("allMonkeys");
  const el = e.parentNode.getElementsByClassName('display')[0]
  if(el.style.display==='none'){
    el.style.display='block'
  } else {
    el.style.display='none'

  }
}

(() => {

  renderMonkeysTemplate();
  async function renderMonkeysTemplate() {
    const source = await fetch("http://127.0.0.1:5500/03.%20Popular%20Monkeys/template.hbs").then(res => res.text());
    const template = Handlebars.compile(source);
    
    const context = { monkeys: window.monkeys };
    const html = template(context);
    
    document.getElementById("allMonkeys").innerHTML = html;
  }
})();


