class Person  {
    constructor(first,last){
        // _firstName;
        // _lastName;
        this._first=first,
        this._last=last

    }
    get firstName (){
        return this._first
    }
    set firstName (x){
        return this._first=x
    }
    get lastName (){
        return this._last
    }
    set lastName (x){
        return this._last=x
    }
    get fullName (){
        return `${this.firstName} ${this.lastName}`
    }
    set fullName(x){
        let name = x.split(' ');
        if(name.length===2){
            this.firstName=name[0];
            this.lastName=name[1]
        }
        return `${this.firstName} ${this.lastName}`
        
    }
}
let person = new Person("Peter", "Ivanov");
console.log(person.fullName);//Peter Ivanov
person.firstName = "George";
console.log(person.fullName);//George Ivanov
person.lastName = "Peterson";
console.log(person.fullName);//George Peterson
person.fullName = "Nikola Tesla";
console.log(person.firstName)//Nikola
console.log(person.lastName)//Tesla
 person = new Person("Albert", "Simpson");
console.log(person.fullName);//Albert Simpson
person.firstName = "Simon";
console.log(person.fullName);//Simon Simpson
person.fullName = "Peter";
console.log(person.firstName) // Simon
console.log(person.lastName) // Simpson
