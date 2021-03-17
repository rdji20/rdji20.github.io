"use strict";
(function () {
  window.addEventListener("load", init);

  function init() {}

  /**
   * @param {string} idName takes any id of the html
   * @return {object} DOM object associated with id
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }
})();
