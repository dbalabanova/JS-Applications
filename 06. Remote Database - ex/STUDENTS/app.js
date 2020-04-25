import { get, post } from "./requester.js";

const elements = {
  addStudent: () => document.getElementById("addStudent"),
  idNumber: () => document.getElementById("idNumber"),
  firstName: () => document.getElementById("firstName"),
  lastName: () => document.getElementById("lastName"),
  facultyNumber: () => document.getElementById("facultyNumber"),
  grade: () => document.getElementById("grade"),
  sortedStudents: () => document.getElementById("sortedStudents")
};

async function extractAllStudents() {
  try {
    const students = await get("appdata", "students");
    const fragment = document.createDocumentFragment();

    students.sort((a, b) => a.id - b.id);
    students.forEach(s => {
      const tr = document.createElement("tr");
      const idNumber = document.createElement("td");
      const firstName = document.createElement("td");
      const lastName = document.createElement("td");
      const facultyNumber = document.createElement("td");
      const grade = document.createElement("td");

      idNumber.textContent = s.id;
      firstName.textContent = s.FirstName;
      lastName.textContent = s.LastName;
      facultyNumber.textContent = s.FacultyNumber;
      grade.textContent = s.Grade;
      tr.append(idNumber, firstName, lastName, facultyNumber, grade);
      elements.sortedStudents().appendChild(tr);
    });

  } catch (err) {
    alert(err);
  }
}
extractAllStudents();

elements.addStudent().addEventListener("click", addAStudent);
async function addAStudent(e) {
  e.preventDefault();
  const id = elements.idNumber();
  const firstName = elements.firstName();
  const lastName = elements.lastName();
  const facultyNumber = elements.facultyNumber();
  const grade = elements.grade();
  if (
    id !== null &&
    firstName !== null &&
    lastName !== null &&
    facultyNumber !== null &&
    grade !== null
  ) {
    const data = {
      id: id.value,
      FirstName: firstName.value,
      LastName: lastName.value,
      FacultyNumber: facultyNumber.value,
      Grade: grade.value
    };
    try {
      const student = await post("appdata", "students", data);
      id.value = "";
      firstName.value = "";
      lastName.value = "";
      facultyNumber.value = "";
      grade.value = "";
      elements.sortedStudents().innerHTML=''
      extractAllStudents();
    } catch (err) {
      alert(err);
    }
  }
}
