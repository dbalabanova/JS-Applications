function getArticleGenerator(input){   
	//debugger
	let initial = [...input];
	const diva = document.getElementById('content');
	diva.style = 'width:600px; text-align: center; font-size: 1.5em'
	
   
        return function(){
			//debugger
			if(initial.length>0){
				let createA= document.createElement('article')
            let createP = document.createElement('p');
			createP.textContent=initial.shift();
			createP.style= 'border: 2px solid blue; padding: 2em; margin: 1em'
			createA.appendChild(createP)
			diva.appendChild(createA);

}
    }
}