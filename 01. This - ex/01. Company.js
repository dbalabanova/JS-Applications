class Company {
  constructor() {
    this.departments = [];
  }
  addEmployee(username, salary, position, department) {
    let user = this.departments.find(x => {
      return x.username === username;
    });
    if (
      username === "" ||
      salary === "" ||
      position === "" ||
      department === "" ||
      username === undefined ||
      salary === undefined ||
      position === undefined ||
      department === undefined ||
      username === null ||
      salary === null ||
      position === null ||
      department === null
    ) {
      throw new Error(`Invalid input!`);
    }
    if (salary < 0) {
      throw new Error(`Invalid input!`);
    }
  
    let ifDepartment = this.departments.find(x=>x.name===department);
    if(!ifDepartment){
        ifDepartment={
            name:department,
            employees:[],
            avgSalary :function () {
               return this.employees.reduce((prev,curr)=>prev+curr.salary,0)/this.employees.length
            }
        }
    this.departments.push(ifDepartment);
    }
   ifDepartment.employees.push({
       username,
       position,
       salary
   })
   return `New employee is hired. Name: ${username}. Position: ${position}`
   
  }
  bestDepartment() {
  //   let output = '';
  //   let highestSalary  = this.departments.sort((a,b)=>b.avgSalary()-a.avgSalary())[0];
  //  output+=`Best Department is: ${highestSalary.name}\nAvarage salary: ${(highestSalary.avgSalary()).toFixed(2)}`
  //   let sorted = highestSalary.employees.sort((a,b)=>{
  //     return b.salary-a.salary || a.username.localeCompare(b.username)
  //   })
  //   for (let person of sorted) {
  //     output+=`\n${person.username} ${person.salary} ${person.position}`
  //   }
  //   return output.trim()
  const [best] = [...this.departments]
    .sort((a,b)=>{
      return b.avgSalary()-a.avgSalary()
    });
    let output = `Best Department is: ${best.name}\n`;
    output+=`Average salary: ${best.avgSalary().toFixed(2)}\n`;
    output+=[...best.employees]
      .sort((a,b)=> b.salary-a.salary || a.username.localeCompare(b.username))
      .map(a=> `${a.username} ${a.salary} ${a.position}`)
      .join('\n');

      return output
  }
}

let c = new Company();
c.addEmployee("Stanimir", 2000, "engineer", "Construction");
c.addEmployee("Pesho", 1500, "electrical engineer", "Construction");
c.addEmployee("Slavi", 500, "dyer", "Construction");
c.addEmployee("Stan", 2000, "architect", "Construction");
c.addEmployee("Stanimir", 1200, "digital marketing manager", "Marketing");
c.addEmployee("Pesho", 1000, "graphical designer", "Marketing");
c.addEmployee("Gosho", 1350, "HR", "Human resources");
console.log(c.bestDepartment());
