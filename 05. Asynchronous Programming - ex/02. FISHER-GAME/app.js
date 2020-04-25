function attachEvents() {
  const elements = {
    updateBtn: () => document.getElementsByClassName("update")[0],
    deleteBth: () => document.getElementsByClassName("delete")[0],
    loadBtn: () => document.getElementsByClassName("load")[0],
    addBtn: () => document.getElementsByClassName("add")[0],
  
    loadAngler: () => document.querySelectorAll("input.angler ")[1],
    loadWeight: () => document.querySelectorAll("input.weight")[1],
    loadLocation: () => document.querySelectorAll("input.location")[1],
    loadBait: () => document.querySelectorAll("input.bait")[1],
    loadCaptureTime: () => document.querySelectorAll("input.captureTime")[1],
    catchField: () => document.getElementById("catches"),
    exampleCatch: () => document.querySelector("div.catch")
  };

  elements.addBtn().addEventListener("click", addCatch);
  function addCatch() {
    let angler = elements.loadAngler().value;
    let weight = elements.loadWeight().value;
    let loaction = elements.loadLocation().value;
    let bait = elements.loadBait().value;
    let captureTime = elements.loadCaptureTime().value;
    catches
      .post({ angler, weight, loaction, bait, captureTime })
      .catch(err => alert("Inncorrect data!"));
  }
  elements.loadBtn().addEventListener("click", loadCatches);
  function loadCatches() {
    catches
      .get()
      .then(showAllCatches)
      .catch(err => alert("There is nothing to display!"));
  }
  function getElements(theDocument, theClass) {
    return theDocument.querySelector(theClass);
  }
  function showAllCatches(data) {
    let info = Object.entries(data);
    //elements.catchField().innerHTML=copyCatch
    for (let line of info) {
      
      let copyCatch = elements.exampleCatch().cloneNode(true);
     
      let [key, value] = line;

      let { angler, weight, bait, captureTime, location, species } = value;

      copyCatch.setAttribute("data-id", key);
      getElements(copyCatch, "input.angler").value = angler;
      getElements(copyCatch, "input.weight").value = weight;
      getElements(copyCatch, "input.bait").value = bait;
      getElements(copyCatch, "input.captureTime").value = captureTime;
      getElements(copyCatch, "input.location").value = location;
      getElements(copyCatch, "input.species").value = species;
      elements.catchField().appendChild(copyCatch);

      copyCatch
        .getElementsByClassName("delete")[0]
        .addEventListener("click", deleteCatch);
      copyCatch
        .getElementsByClassName("update")[0]
        .addEventListener("click", updateCatch);
    }
    elements.exampleCatch().remove();
  }
  function deleteCatch(e) {
    let id = e.target.parentNode.getAttribute("data-id");
    catches
      .del(id)
      .then(() => {
      
        loadCatches()}) // тук трябва да се презарежда на ново !!!1
      .catch(err => {
        alert("You cannot delete this!");
      });
  }
  function updateCatch(e) {
    let id = e.target.parentNode.getAttribute("data-id");
    let angler = getElements(e.target.parentNode, "input.angler").value;
    let weight = getElements(e.target.parentNode, "input.weight").value;
    let bait = getElements(e.target.parentNode, "input.bait").value;
    let capture = getElements(e.target.parentNode,"input.captureTime").value;
    let location = getElements(e.target.parentNode, "input.location").value;
    let species = getElements(e.target.parentNode, "input.species").value;

    catches
      .put(id, {
        angler,
        weight,
        bait,
        capture,
        location,
        species
      })
      .then(()=>{
      
        loadCatches()
      })
      .catch(err => "You cannot update this!");
  }
}

attachEvents();
