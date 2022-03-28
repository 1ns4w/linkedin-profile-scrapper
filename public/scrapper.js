// src/modules/models/Person.js
var Person = class {
  constructor(name, workExperience) {
    this.name = name;
    this.workExperience = workExperience;
  }
};

// src/modules/models/Work.js
var WorkExperience = class {
  constructor(company, position, totalDuration, startDate, endDate) {
    this.company = company;
    this.position = position;
    this.totalDuration = totalDuration;
    this.startDate = startDate;
    this.endDate = endDate;
  }
};

// src/modules/utils/autoscroll.js
var loadPageContent = async (loadingDelaySeconds = 3) => {
  while (true) {
    let previousScrollHeight = document.documentElement.scrollHeight;
    window.scrollTo({ top: previousScrollHeight, behavior: "smooth" });
    await new Promise((r) => setTimeout(r, loadingDelaySeconds * 1e3));
    if (previousScrollHeight === document.documentElement.scrollHeight) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await new Promise((r) => setTimeout(r, 1e3));
      break;
    }
  }
};

// src/modules/utils/xpath.js
var xpathEval = (expression, node) => {
  return document.evaluate(expression, node, null, XPathResult.ANY_TYPE, null);
};

// src/modules/utils/cleantext.js
var cleanText = (text) => {
  return text.match(/[^\s|\n]+/ig).join(" ");
};

// src/scrapper.js
var findSection = (sectionName) => {
  return xpathEval(`//section[./div[@id="${sectionName}"]]/div[3]`, document).iterateNext();
};
var scrapExperienceSection = () => {
  let worksIterator = xpathEval("(//section[.//span[contains(text(), 'Experiencia')] or .//h2[contains(@class, 't-20')]]//ul)[1]/li[.//a[contains(@href, 'company') or contains(@href, 'linkedin.com/search')]]//div[contains(@class, 'pvs-entity') and count(./div) = 2 and not(.//span[contains(@class, 'pvs-entity__path-node')])]", document);
  let thisWork = worksIterator.iterateNext();
  let workExperiences = [];
  while (thisWork) {
    let thisWorkHistory = xpathEval("(.)/../../../../../../../../../div[1][./a]", thisWork).iterateNext();
    if (thisWorkHistory) {
      let company = cleanText(xpathEval(".//span[contains(@class, 't-bold')]/span[@aria-hidden]", thisWorkHistory).iterateNext().textContent);
      let position = cleanText(xpathEval(".//span[contains(@class, 't-bold')]/span[@aria-hidden]", thisWork).iterateNext().textContent);
      let durationInfo = cleanText(xpathEval(".//span[contains(@class, 't-normal')]/span[@aria-hidden]", thisWork).iterateNext().textContent).split(" \xB7 ");
      let totalDuration = durationInfo[1];
      let durationRange = durationInfo[0].split(" - ");
      let startDate = durationRange[0];
      let endDate = durationRange[durationRange.length - 1];
      workExperiences.push(new WorkExperience(company, position, totalDuration, startDate, endDate));
      console.log(position);
    }
    thisWork = worksIterator.iterateNext();
  }
  return workExperiences;
};
var scrapProfile = async () => {
  await loadPageContent();
  let fullname = document.getElementsByTagName("h1")[0].textContent;
  let workExperiences;
  let workSection = findSection("experience");
  let workSectionDropdown = xpathEval("./div/a", workSection).iterateNext();
  if (workSectionDropdown) {
    workSectionDropdown.click();
    await new Promise((r) => setTimeout(r, 8e3));
    workExperiences = scrapExperienceSection();
    await new Promise((r) => setTimeout(r, 8e3));
    let returnButton = xpathEval("//button[contains(@aria-label, 'Volver')]", document).iterateNext();
    returnButton.click();
  } else {
    workExperiences = scrapExperienceSection();
  }
  let port = chrome.runtime.connect({ name: "safePort" });
  port.postMessage(new Person(fullname, workExperiences));
};
scrapProfile();
