function solve() {
  const spanInfo = document.querySelector("#info > span");
  const departBtn = document.getElementById("depart");
  const arriveBtn = document.getElementById("arrive");
  let currentId = "depot";
  let currentName;
  function depart() {
    fetch(`https://judgetests.firebaseio.com/schedule/${currentId}.json`)
      .then(res => res.json())
      .then(data => {
        // debugger
        arriveBtn.disabled = false;
        departBtn.disabled = true;
        let { name, next } = data;
        currentName = name;
        currentId = next;
        spanInfo.innerHTML = `Next stop ${currentName}`;
      })
      .catch(err => {
        spanInfo.innerHTML = "Error";
        arriveBtn.disabled = true;
        departBtn.disabled = true;
      });
  }

  function arrive() {
        arriveBtn.disabled = true;
        departBtn.disabled = false;
        spanInfo.innerHTML = `Arriving at ${currentName}`;
  }

  return {
    depart,
    arrive
  };
}

let result = solve();
