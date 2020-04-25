// function solve(input) {
//   let myObj = {
//     __proto__: {},
//     extend: []
//   };
//    Object.entries(input).forEach(e=>{
//       let [key,value] = e;
//       if(typeof value==='function'){
//         console.log(this.__proto__);
        
//           Object.getPrototypeOf(this.__proto__)[key] = value
//       } else {
//        Object.getPrototypeOf(this.extend).push(value)

//       }
//   });
//   return myObj
// }

function result(){
  let myObj={__proto__: {}}
  myObj.extend=function(template){
  let tmplArr=Object.entries(template);
   
  tmplArr.forEach(key=>{
      let k=key[0];
      let v=key[1];
   
     if (typeof (v)=="function"){
     
         myObj.__proto__[k]=v;
       
     } else {
         myObj[k]=v;
     }
   
  })
   
  }
  return myObj;
  }

// console.log(solve({
//   extensionMethod: function() {},
//   extensionProperty: "someString"
// }))

// let newObj = Object.assign(myObj, template);

// const Extensible = (function() {
//   let id = 0;

//   return class Extensible {
//     constructor() {
//       this.id = id++;
//     }
//     extend(template) {
//       Object.entries(template).forEach(e => {
//         let [key, value] = e;
//         if (typeof value === "function") {
//           Object.getPrototypeOf(this)[key] = value;
//         } else {
//           this[key] = value;
//         }
//       });
//     }
//   };
// })();
