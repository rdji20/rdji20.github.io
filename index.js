"use strict";
(function () {
  window.addEventListener("load", init);

  function init() {
    createEventlisteners();
  }

  /**
   * Creates event click listeners for all the images 
   */
  function createEventlisteners() {
    let logos = id("show-case").children ;
    console.log(logos);
    for(let i = 0; i < logos.length ; i++) {
      logos[i].addEventListener("click", logoClick);
    }
  }

  /**
   * Displays the image clicked to appear bigger and hides other images
   */
  function logoClick() {
    let logos = id("show-case").children ;
    console.log(this)
    for(let i = 0; i < logos.length ; i++) {
      logos[i].classList.add("hidden");
    }
    this.classList.remove("hidden");
    this.classList.add("bigger");
    this.classList.remove("fit");
    this.addEventListener("click", closeImg);
  }

  /**
   * Closes the image selected to return to the showcase
   */
  function closeImg() {
    this.classList.remove("bigger");
    let logos = id("show-case").children ;
    console.log(logos);
    for(let i = 0; i < logos.length ; i++) {
      logos[i].classList.remove("hidden");
    }
    this.classList.add("fit");
    this.removeEventListener("click", closeImg);
  }

  /**
   * @param {string} idName takes any id of the html
   * @return {object} DOM object associated with id
   */
  function id(idName) {
    return document.getElementById(idName);
  }

})();
