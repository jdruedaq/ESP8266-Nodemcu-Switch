/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes the SmartHome.
function SmartHome() {
  document.addEventListener('DOMContentLoaded', function () {
    // Shortcuts to DOM Elements.
    this.userWelcome = document.getElementById('user-welcome');

    // Bind events.
    this.updateButton = document.getElementById('demo-washer-update');
    this.updateButton.addEventListener('click', this.updateState.bind(this));
    this.washer = document.getElementById('demo-washer');
    this.requestSync = document.getElementById('request-sync');
    this.requestSync.addEventListener('click', () => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log("Request SYNC success!");
        }
      };
      xhttp.open("POST", "https://us-central1-oneago--home.cloudfunctions.net/requestsync", true);
      xhttp.send();
    });

    this.initFirebase();
    this.initWasher();
  }.bind(this));
}

SmartHome.prototype.initFirebase = () => {
  // Initiates Firebase.
  console.log("Firebase iniciado");
};

SmartHome.prototype.initWasher = () => {
  console.log("Logeado con el usuario por defecto");
  this.uid = "123";
  this.smarthome.userWelcome.innerHTML = "Bienbenido usuario 123!";

  this.smarthome.handleData();
  this.smarthome.washer.style.display = "block";
}

SmartHome.prototype.setToken = (token) => {
  document.cookie = '__session=' + token + ';max-age=3600';
};

SmartHome.prototype.handleData = () => {
  let uid = this.uid;

  let elOnOff = document.getElementById('demo-washer-onOff');

  firebase.database().ref('/').child('light').on("value", (snapshot) => {
    if (snapshot.exists()) {
      var washerState = snapshot.val();
      console.log(washerState)
      washerState.Modes = washerState.Modes || {};
      washerState.Toggles = washerState.Toggles || {};

      if (washerState.OnOff.on) elOnOff.MaterialSwitch.on();
      else elOnOff.MaterialSwitch.off();
    }
  })
}

SmartHome.prototype.updateState = () => {
  let elOnOff = document.getElementById('demo-washer-onOff');

  let pkg = {
    OnOff: { on: elOnOff.classList.contains('is-checked') }
  };

  console.log(pkg);
  firebase.database().ref('/').child('light').set(pkg);
}

// Load the SmartHome.
window.smarthome = new SmartHome();
