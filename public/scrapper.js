(() => {
  // src/modules/utils/xpath.js
  var XPath = (expression, node) => {
    return document.evaluate(expression, node, null, XPathResult.ANY_TYPE, null);
  };

  // src/scrapper.js
  var fullname = document.getElementsByTagName("h1")[0].textContent;
  var workSection = XPath("(//section[.//span[contains(text(), 'Experiencia')]]//ul)[1]", document).iterateNext();
  var workExperience = [];
  console.log(fullname, workSection);
  var port = chrome.runtime.connect({ name: "safePort" });
  port.postMessage(fullname, workExperience);
})();
