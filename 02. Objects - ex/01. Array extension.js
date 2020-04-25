(function solve(){
Array.prototype.last= function(){
    return this[this.length-1]
}
Array.prototype.skip = function(n) {
    let newArr =[]
    for (let i = n; i < this.length; i++) {
        newArr.push(this[i])
        
    }
   return newArr
}
Array.prototype.take=function(n){
    let newArr = []
    for (let i = 0; i < n; i++) {
        newArr.push(this[i])
        
    }
    return newArr
}
Array.prototype.sum= function(){
    let result = 0;
    for (let i = 0; i < this.length; i++) {
       result+=this[i]
        
    }
    return result
}
Array.prototype.average= function(){
    let result = 0;
    for (let i = 0; i < this.length; i++) {
       result+=this[i]
        
    }
    return result/this.length
}
} ())
let arr = [1,2,3,4,5]
console.log(arr.last())