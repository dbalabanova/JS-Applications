function getInfo() {
  const stopID = document.getElementById("stopId");
  const stopName = document.getElementById("stopName");
  const busesUl = document.getElementById("buses");

  const url = `https://judgetests.firebaseio.com/businfo/${stopId.value}.json `;
    stopName.innerHTML='';
    busesUl.innerHTML='';
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const { name, buses } = data;
      stopName.textContent = name;
      console.log(buses);

      let infoBuses = Object.entries(buses);
      for (let bus of infoBuses) {
        let [busNumber, time] = bus;
        let createLi = document.createElement("li");
        createLi.textContent = `Bus ${busNumber} arrives in ${time} minutes`;
        busesUl.appendChild(createLi);
      }
    })
    .catch((error)=>{stopName.textContent = 'Error'});
}
