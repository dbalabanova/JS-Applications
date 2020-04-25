import { get, post } from "./requester.js";

const elements = {
  venueDate: () => document.getElementById("venueDate"),
  venueInfo: () => document.getElementById("venue-info"),
  moreInfoBtns: () => Array.from(document.querySelectorAll("#moreInfo"))
};
const actions = {
  getVenues: async function() {
    const date = elements.venueDate().value;
    const calledVenue = await post("rpc", `custom/calendar?query=${date}`);
    calledVenue.forEach(id => {
      displayVenues(id);
    });
  }
};
async function displayVenues(id) {
  const venue = await get("appdata", `venues/${id}`);

  //const fragment = document.createDocumentFragment();
  const div = document.createElement("div");
  div.className = "venue";
  div.id = `${id}`;

  const inner = `<div class="venue" id="${id}">
    <span class="venue-name id="name">${venue.name}<input class="info" type="button" id = "moreInfo"value="More info"></span>
        
    <div class="venue-details" id="details" style="display: none;">
        <table>
            <tr>
                <th>Ticket Price</th>
                <th>Quantity</th>
                <th></th>
            </tr>
            <tr>
                <td id="venuePrice" class="venue-price">${venue.price} lv</td>
                <td><select id="quantity" class="quantity">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select></td>
                <td><input class="purchase" data-id=${id} id = "purchase" type="button" value="Purchase"></td>
            </tr>
        </table>
        <span class="head">Venue description:</span>
        <p class="description">${venue.description}</p>
        <p class="description">Starting time: ${venue.startingHour}</p>
    </div>
</div>`;
  div.innerHTML = inner;
  elements.venueInfo().appendChild(div);
  const moreInfoBtn = div.querySelector("#moreInfo");
  moreInfoBtn.addEventListener("click", showMoreInfo);

  function showMoreInfo(e) {
    const currentVenue = e.target.parentNode.parentNode;

    if (currentVenue.querySelector("#details").style.display === "none") {
      currentVenue.querySelector("#details").style.display = "block";
    } else {
      currentVenue.querySelector("#details").style.display = "none";
    }

    const purchaseBtn = currentVenue.querySelector("#purchase");
    purchaseBtn.addEventListener("click", showConfirmation);

    function showConfirmation(e) {
      const name = venue.name;
      const price = venue.price;
      const quantity = currentVenue.querySelector("#quantity").value;

      currentVenue.parentNode.parentNode.innerHTML = `<span class="head">Confirm purchase</span>
            <div class="purchase-info">
            <span>${name}</span>
            <span>${quantity} x ${price}</span>
            <span>Total: ${quantity * price} lv</span>
            <input type="button" id="confirm"value="Confirm">
        </div>`;
      const confirmBtn = document.getElementById("confirm");
      confirmBtn.addEventListener("click", confirmationPurcahse);
      async function confirmationPurcahse() {
        const html = await post('rpc',`custom/purchase?venue=${id}&qty=${quantity}`)
     elements.venueInfo().innerHTML=
     `You may print this page as your ticket
     ${html.html}`
    }
    }
  }
}

function handleEvent(e) {
  if (typeof actions[e.target.id] === "function") {
    e.preventDefault();
    actions[e.target.id]();
  }
}
(function attachEvents() {
  document.addEventListener("click", handleEvent);
})();
