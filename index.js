"use strict";

(function () {
  window.addEventListener("load", init);

  function init() {
    id("menu").addEventListener("click", showMenuScreen);
    id("exit-icon").addEventListener("click", showScreen);
    id("ame-btn").addEventListener("click", getAboutMe);
  }

  function getAboutMe() {}

  function showScreen() {
    id("main_screen").classList.remove("hidden");
    id("menu").classList.remove("hidden");
    id("menu_links").classList.remove("unscrolled");
  }

  function showMenuScreen() {
    id("main_screen").classList.add("hidden");
    id("menu").classList.add("hidden");
    id("menu_links").classList.add("unscrolled");
  }

  /**
   * @param {string} idName takes any id of the html
   * @return {object} DOM object associated with id
   */
  function id(idName) {
    return document.getElementById(idName);
  }
})();
