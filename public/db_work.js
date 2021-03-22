"use strict";
(function () {
  window.addEventListener("load", init);

  function init() {
    let txt = id("design-header").children[0].textContent;
    let splitTxt = txt.split("");

    makeSpans(txt, splitTxt);
    typeWritingEffect(splitTxt);
  }

  /**
   * Creates span tags for every letter in the array and appends them to
   * the header tag.
   * @param {String} txt header text content
   * @param {Object} splitTxt header text letters in an array
   */
  function makeSpans(txt, splitTxt) {
    id("design-header").children[0].textContent = "";
    for (let i = 0; i < txt.length; i++) {
      let tag = gen("span");
      tag.textContent = splitTxt[i];
      tag.classList.add("hidden");
      id("design-header").children[0].appendChild(tag);
    }
  }

  /**
   * Removes a class for the letters in the array to be shown every certain time
   * @param {Object} splitTxt header text letters in an array
   */
  function typeWritingEffect(splitTxt) {
    let char = 0;
    let timer = setInterval(function () {
      let span = qsa("span");
      console.log(span[char]);
      span[char].classList.remove("hidden");
      char++;
      if (char === splitTxt.length) {
        complete(timer);
        return;
      }
    }, 90);
  }

  /**
   * Clears the timer
   * @param {Integer} timer identifying value of created timer
   */
  function complete(timer) {
    clearInterval(timer);
    timer = null;
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

  /**
   * Returns new element with given tag name.
   * @param {string} elType - HTML tag name for new DOM element.
   * @returns {object} New DOM object for a HTML tag.
   */
  function gen(elType) {
    return document.createElement(elType);
  }
})();
