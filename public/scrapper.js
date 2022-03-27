// src/modules/utils/autoscroll.js
var loadPageContent = async (loadingDelaySeconds = 5) => {
  while (true) {
    let previousScrollHeight = document.documentElement.scrollHeight;
    window.scrollTo({ top: previousScrollHeight, behavior: "smooth" });
    await new Promise((r) => setTimeout(r, loadingDelaySeconds * 1e3));
    if (previousScrollHeight === document.documentElement.scrollHeight) {
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
