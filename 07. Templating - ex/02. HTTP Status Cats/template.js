function show(e){
    const btn = document.getElementsByClassName('showBtn')[0]
const el = e.parentNode.getElementsByClassName('status')[0]
if(el.style.display==="none"){
    el.style.display='block'
    btn.textContent='Hide status code'

}else {
   el.style.display='none'
   btn.textContent='Show status code'

}
}

(() => {
     renderCatTemplate();

     async function renderCatTemplate() {
         const source = await fetch('http://127.0.0.1:5500/02.%20HTTP%20Status%20Cats/templates/allcats.hbs')
         .then(res=>res.text())
         const template = Handlebars.compile(source)

         const context ={cats:window.cats}
         const html = template(context)

         document.getElementById('allCats').innerHTML=html
     }
 
})()
