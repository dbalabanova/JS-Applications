//function solve() {
  class Figure {
      units= {
          cm: "",
          mm: "",
          m: ""
      }
    defaultUnits= "cm";

    changeUnits(x) {
      this.defaultUnit = x;
    }
    get area() {
      return NaN;
    }
    toString() {
      return `Figures units: ${this.defaultUnit} Area: `;
    }
  }

//   class Circle extends Figure {
//     constructor(units, radius) {
//       super(units), (this.radius = radius);
//     }
//     changeUnits() {
//       this.units = units;
//     }
//     get area() {
//       let calcArea = Math.PI * this.radius * this.radius;
//       return calcArea;
//     }
//     toString() {
//       return `Figures units: ${this.units} Area: ${this.calcArea} - radius: ${this.radius}`;
//     }
//   }

//   class Rectangle extends Figure {
//     constructor(units, width, height) {
//       super(units), (this.width = width), (this.height = height);
//     }
//     get area() {
//       let calcArea = this.width * this.height;
//       return calcArea;
//     }
//     toString() {
//       return `Figures units: ${this.units} Area: ${this.calcArea} - width: ${this.width}, height: ${height}`;
//     }
//   }
//   let c = new Circle(5);
//   console.log(c.area); // 78.53981633974483
//   console.log(c.toString()); // Figures units: cm Area: 78.53981633974483 - radius: 5

  // return {
  //     Figure,
  //     Circle,
  //     Rectangle
  // }
// }
// solve();
let a = new Figure;
console.log(a.toString())
