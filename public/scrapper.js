// src/modules/utils/autoscroll.js
var loadPageContent = async (seconds = 5) => {
  while (true) {
    let pageHeight = document.body.scrollHeight;
    window.scrollTo({ top: pageHeight, behavior: "smooth" });
    await new Promise((r) => setTimeout(r, seconds * 1e3));
    if (pageHeight === document.body.scrollHeight) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    }
  }
};

// src/scrapper.js
loadPageContent();
var fullname = document.getElementsByTagName("h1")[0].textContent;
var workExperience = [];
console.log(fullname, workExperience);
