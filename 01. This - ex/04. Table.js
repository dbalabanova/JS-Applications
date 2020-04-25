function solve(){
    const table = Array.from(document.getElementsByTagName('tr'));
    let rows = table.slice(1)
  rows.forEach(x=>{
     x.addEventListener('click', coloring)
  });
  
  function coloring() {
     if(this.hasAttribute('style')){
        this.removeAttribute('style')
     } else {
        rows.forEach(x=>x.removeAttribute('style'))
        this.style.backgroundColor="#413f5e"
     }
  
  }
  }