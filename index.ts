/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

function initMap(): void {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  const destinationInput = document.getElementById(
    "destination-input"
  ) as HTMLInputElement;
  const destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput,
    { fields: ["place_id"] }
  );

  // // To create a map
  // const map = new google.maps.Map(
  //   document.getElementById("map") as HTMLElement,
  //   {
  //     zoom: 13,
  //     center: { lat: 52.40, lng: -0.80 },
  //     disableDefaultUI: true,
  //   }
  // );

  // directionsRenderer.setMap(map);
  // directionsRenderer.setPanel(
  //   document.getElementById("sidebar") as HTMLElement
  // );

  const control = document.getElementById("floating-panel") as HTMLElement;

  // // To friendly position the map
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  const realoader = function () {
    onChangeHandler();
    setInterval(onChangeHandler,10000); // Refreshes Direction every 10s
  };

  (document.getElementById("submit-button") as HTMLElement).addEventListener(
    "click",
    realoader
  );
}

function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer
) {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude, position.coords.longitude);
    const start = { lat: position.coords.latitude, lng: position.coords.longitude }
    const end = (document.getElementById("destination-input") as HTMLInputElement).value;

    const maneuver = {"turn-slight-left": "turn_slight_left", "turn-sharp-left": "turn_sharp_left",  "uturn-left": "u_turn_left", "uturn-right": "u_turn_right", "turn-left": "turn_left", "turn-slight-right": "turn_slight_right", "turn-sharp-right": "turn_sharp_right", "turn-right": "turn_right", "straight": "straight", "ramp-left": "ramp_left", "ramp-right": "ramp_right", "merge": "merge", "fork-left": "fork_left", "fork-right": "fork_right", "ferry": "directions_boat", "ferry-train": "train", "roundabout-left": "roundabout_left", "roundabout-right": "roundabout_right"}

    directionsService
      .route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        console.log(response.routes[0]);

        if (maneuver.hasOwnProperty(response.routes[0].legs[0].steps[0].maneuver)){
          (document.getElementById("direction-icon") as HTMLSpanElement).innerText = maneuver[response.routes[0].legs[0].steps[0].maneuver]
        } else if (response.routes[0].legs[0].steps[0].maneuver == "") {
          let instructions = response.routes[0].legs[0].steps[0].instructions;

          if (instructions.toLowerCase().includes("north-west")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "north_west";
          }
          else if (instructions.toLowerCase().includes("north-east")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "north_east";
          }
          else if (instructions.toLowerCase().includes("south-west")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "south_west";
          }
          else if (instructions.toLowerCase().includes("south-east")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "south_east";
          }
          else if (instructions.toLowerCase().includes("west")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "west";
          }
          else if (instructions.toLowerCase().includes("east")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "east";
          }
          else if (instructions.toLowerCase().includes("south")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "south";
          }
          else if (instructions.toLowerCase().includes("keep left")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "chevron_leftstraight";
          }
          else if (instructions.toLowerCase().includes("keep right")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "straightchevron_right";
          }
          else if (instructions.toLowerCase().includes("exit")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "turn_slight_left";
          }
          else if (instructions.toLowerCase().includes("continue") || instructions.toLowerCase().includes("straight") || instructions.toLowerCase().includes("north")) {
            (document.getElementById("direction-icon") as HTMLSpanElement).innerText = "straight";
          }
        };

        console.log(response.routes[0].legs[0].distance?.text);
        (document.getElementById("total-distance") as HTMLSpanElement).innerText = response.routes[0].legs[0].distance?.text || "N/A";
        console.log(response.routes[0].legs[0].duration?.text);
        (document.getElementById("total-duration") as HTMLSpanElement).innerText = response.routes[0].legs[0].duration?.text || "N/A";
        console.log(response.routes[0].legs[0].end_address);
        (document.getElementById("destination") as HTMLSpanElement).innerText = response.routes[0].legs[0].end_address || "N/A";
        console.log(response.routes[0].legs[0].steps[0].distance?.text);
        (document.getElementById("step-distance") as HTMLSpanElement).innerText = response.routes[0].legs[0].steps[0].distance?.text || "N/A";
        console.log(response.routes[0].legs[0].steps[0].duration?.text);
        (document.getElementById("step-duration") as HTMLSpanElement).innerText = response.routes[0].legs[0].steps[0].duration?.text || "N/A";
        console.log(response.routes[0].legs[0].steps[0].instructions);
        (document.getElementById("step-instructions") as HTMLSpanElement).innerHTML = response.routes[0].legs[0].steps[0].instructions || "N/A";
        // // To Render directions on a map
        // directionsRenderer.setDirections(response);
        (document.getElementById("initial-nav") as HTMLDivElement).style.display = "none";
        (document.getElementById("main-nav") as HTMLDivElement).style.display = "flex";
        (document.getElementById("secondary-nav") as HTMLDivElement).style.display = "block";
      })
      .catch((e) => console.log("Directions request failed due to " + status));
  });

}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
