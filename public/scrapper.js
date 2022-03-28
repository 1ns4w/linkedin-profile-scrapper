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

// src/modules/utils/xpath.js
var xpathEval = (expression, node) => {
  return document.evaluate(expression, node, null, XPathResult.ANY_TYPE, null);
};

// src/scrapper.js
var scrapProfile = async () => {
  await loadPageContent();
  let fullname = document.getElementsByTagName("h1")[0].textContent;
  let workSection = xpathEval("//section[./div[@id='experience']]/div[3]", document).iterateNext();
  let workSectionDropdown = xpathEval("./div/a", workSection).iterateNext();
  if (workSectionDropdown) {
    workSectionDropdown.click();
    await new Promise((r) => setTimeout(r, 8e3));
    let returnButton = xpathEval("//button[contains(@aria-label, 'Volver')]", document).iterateNext();
    returnButton.click();
  }
};
scrapProfile();
