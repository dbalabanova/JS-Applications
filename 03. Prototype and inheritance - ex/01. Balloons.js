// //(
//     function result(){
//     class Balloon {
//     constructor (color,gasWeight) {
//         this.color=color,
//         this.gasWeight=Number(gasWeight)
//     }
// }

// class PartyBalloon extends Balloon{
//     constructor (color,gasWeight,ribbonColor,ribbonLength){
//         super(color,gasWeight),
//         this.ribbonColor=ribbonColor,
//         this.ribbonLength=Number(ribbonLength)
//         this._ribbon= {
//             color: this.ribbonColor,
//             length: Number(this.ribbonLength)
//         }
//     }
//     get ribbon(){
//         return this._ribbon
//     }
// }

// class BirthdayBalloon extends PartyBalloon{
// constructor(color,gasWeight,ribbonColor,ribbonLength,text){
//     super(color,gasWeight,ribbonColor,ribbonLength),
//     this._text=text
// }
// get text(){
//     return this._text
// }
// }

// return{
//     Balloon,
//     PartyBalloon,
//     BirthdayBalloon
// }
// }
// //())
// let classes = result()
// console.log(result())

function solve(){
function Balloon(color, gasWeight) {
  (this.color = color), (this.gasWeight = Number(gasWeight));
}
function PartyBalloon(color, gasWeight, ribbonColor, ribbonLength) {
  Balloon.call(this, color, gasWeight);
  (this.ribbonColor = ribbonColor), (this.ribbonLength = ribbonLength);
  Object.defineProperty(this, "ribbon", {
    get: function() {
      return { color: this.ribbonColor, length: Number(this.ribbonLength) };
    }
  });
}
Object.setPrototypeOf(PartyBalloon,Balloon)
// PartyBalloon.prototype = Object.create(Balloon.prototype);
// PartyBalloon.prototype.constructor = PartyBalloon

function BirthdayBalloon(color,gasWeight,ribbonColor,ribbonLength,text){
    PartyBalloon.call(this, color,gasWeight,ribbonColor,ribbonLength)
    this._text=text

    Object.defineProperty(this,'text', {
        get: function(){
            return this._text
        }
    })
}
Object.setPrototypeOf(BirthdayBalloon,PartyBalloon)

// BirthdayBalloon.prototype = Object.create(PartyBalloon.prototype);
// BirthdayBalloon.prototype.constructor=BirthdayBalloon
return {
    Balloon,
    PartyBalloon,
    BirthdayBalloon
}
}
const a = new BirthdayBalloon('p',4,'o',7,'kdid')
console.log(a);
const b = new Balloon( 'p',4)
console.log();


