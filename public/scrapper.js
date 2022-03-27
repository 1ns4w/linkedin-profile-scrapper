// src/scrapper.js
var scrollPage = async (seconds) => {
  while (true) {
    let pageHeight = document.body.scrollHeight;
    window.scrollTo(0, pageHeight);
    await new Promise((r) => setTimeout(r, seconds * 1e3));
    if (pageHeight === document.body.scrollHeight) {
      window.scrollTo(0, 0);
      break;
    }
  }
};
scrollPage(5);
var fullname = document.getElementsByTagName("h1")[0].textContent;
var workExperience = [];
console.log(fullname, workExperience);
