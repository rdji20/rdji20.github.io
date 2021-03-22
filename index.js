"use strict";
(function () {
  window.addEventListener("load", init);

  function init() {
    createEventlisteners();
  }

  function createEventlisteners() {
    let logos = id("show-case").children ;
    console.log(logos);
    for(let i = 0; i < logos.length ; i++) {
      logos[i].addEventListener("click", logoClick);
    }
  }

  function logoClick() {
    let logos = id("show-case").children ;
    console.log(this)
    for(let i = 0; i < logos.length ; i++) {
      logos[i].classList.add("hidden");
    }
    this.classList.remove("hidden");
    this.classList.add("bigger");
    this.addEventListener("click", closeImg);
  }

  function closeImg() {
    this.classList.remove("bigger");
    let logos = id("show-case").children ;
    console.log(logos);
    for(let i = 0; i < logos.length ; i++) {
      logos[i].classList.remove("hidden");
    }
    this.removeEventListener("click", closeImg);
  }

  /**
   * @param {string} idName takes any id of the html
   * @return {object} DOM object associated with id
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * @param {string} selector takes any class and/or children.
   * @return {object} DOM object associated with all class.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

   /**
   * Returns new element with given tag name.
   * @param {string} elType - HTML tag name for new DOM element.
   * @returns {object} New DOM object for a HTML tag.
   */
  function gen(elType) {
    return document.createElement(elType);
  }

})();
