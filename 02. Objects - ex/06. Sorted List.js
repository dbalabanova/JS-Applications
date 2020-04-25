function solve() {
    return {
        elements: [],
        size:0,
        add: function(element) {
            this.elements.push(element)
            this.elements.sort((a,b)=>a-b);
           this.size++;
        },
        remove: function(index) {
           if(this.elements[index]=== undefined){
            throw new Error('Invalid Index');
           } 
           this.elements.splice(index,1)
           this.size--;
        },
        get: function(index) {
            if(this.elements[index]=== undefined){
                throw new Error('Invalid Index');
            } 
            return this.elements[index]

        },
    
        
    }
}