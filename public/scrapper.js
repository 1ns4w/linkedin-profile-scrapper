// src/modules/models/Person.js
var Person = class {
  constructor(name, workExperience, education) {
    this.name = name;
    this.workExperience = workExperience;
    this.education = education;
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

// src/modules/utils/evaluateXPath.js
var evaluateXPath = (expression, node) => {
  return document.evaluate(expression, node, null, XPathResult.ANY_TYPE, null);
};

// src/modules/utils/cleantext.js
var cleanText = (text) => {
  return text.match(/[^\s|\n]+/ig).join(" ");
};

// src/modules/utils/getSectionXpath.js
var getSectionXPath = (sectionName) => {
  return `//section[./div[@id='${sectionName}' or .//h2[contains(@class, 't-20')]]]/div[count(./../div)]`;
};

// src/modules/helpers/XPathConstants.js
var SECTION_DROPDOWN_CLUE = "./div/a";
var SECTION_RETURN_CLUE = "./..//button[contains(@aria-label, 'Volver')]";
var SECTION_ITEMS = `(.//ul)[1]/li[.//a[contains(@href, 'company') or contains(@href, 'linkedin.com/search')]]//div[contains(@class, 'pvs-entity') and count(./div) = 2 and not(.//span[contains(@class, 'pvs-entity__path-node')])]`;
var SECTION_ITEM_HISTORY_CLUE = "(.)/../../../../../../../../../div[1][./a]";
var SECTION_ITEM_WITH_HISTORY_COMPANY_OR_POSITION = ".//span[contains(@class, 't-bold')]/span[@aria-hidden]";
var SECTION_ITEM_WITH_HISTORY_DURATION_INFO = ".//span[contains(@class, 't-normal')]/span[@aria-hidden]";
var SECTION_ITEM_COMPANY = "(.//span[contains(@class, 't-normal')]/span[@aria-hidden])[1]";
var SECTION_ITEM_POSITION = ".//span[contains(@class, 't-bold')]/span[@aria-hidden]";
var SECTION_ITEM_DURATION_INFO = "(.//span[contains(@class, 't-normal')]/span[@aria-hidden])[2]";

// src/scrapper.js
var findSection = (sectionClue) => {
  return evaluateXPath(getSectionXPath(sectionClue), document).iterateNext();
};
var scrapVisibleSection = (section) => {
  let sectionItemsIterator = evaluateXPath(SECTION_ITEMS, section);
  let thisSectionItem = sectionItemsIterator.iterateNext();
  let itemsInformation = [];
  while (thisSectionItem) {
    let thisSectionItemHistory = evaluateXPath(SECTION_ITEM_HISTORY_CLUE, thisSectionItem).iterateNext();
    if (thisSectionItemHistory) {
      let company = cleanText(evaluateXPath(SECTION_ITEM_WITH_HISTORY_COMPANY_OR_POSITION, thisSectionItemHistory).iterateNext().textContent);
      let position = cleanText(evaluateXPath(SECTION_ITEM_WITH_HISTORY_COMPANY_OR_POSITION, thisSectionItem).iterateNext().textContent);
      let durationInfo = cleanText(evaluateXPath(SECTION_ITEM_WITH_HISTORY_DURATION_INFO, thisSectionItem).iterateNext().textContent).split(" \xB7 ");
      let totalDuration = durationInfo[1];
      let durationRange = durationInfo[0].split(" - ");
      let startDate = durationRange[0];
      let endDate = durationRange[durationRange.length - 1];
      itemsInformation.push(new WorkExperience(company, position, totalDuration, startDate, endDate));
    } else {
      let company = cleanText(evaluateXPath(SECTION_ITEM_COMPANY, thisSectionItem).iterateNext().textContent);
      let position = cleanText(evaluateXPath(SECTION_ITEM_POSITION, thisSectionItem).iterateNext().textContent);
      let durationInfo = cleanText(evaluateXPath(SECTION_ITEM_DURATION_INFO, thisSectionItem).iterateNext().textContent).split(" \xB7 ");
      let totalDuration = durationInfo[1];
      let durationRange = durationInfo[0].split(" - ");
      let startDate = durationRange[0];
      let endDate = durationRange[durationRange.length - 1];
      itemsInformation.push(new WorkExperience(company, position, totalDuration, startDate, endDate));
    }
    thisSectionItem = sectionItemsIterator.iterateNext();
  }
  return itemsInformation;
};
var scrapSection = async (sectionName) => {
  let sectionInformation;
  let section = findSection(sectionName);
  let sectionDropdown = evaluateXPath(SECTION_DROPDOWN_CLUE, section).iterateNext();
  if (sectionDropdown) {
    sectionDropdown.click();
    await new Promise((r) => setTimeout(r, 8e3));
    let expandedSection = findSection(sectionName);
    sectionInformation = scrapVisibleSection(expandedSection);
    await new Promise((r) => setTimeout(r, 8e3));
    let returnButton = evaluateXPath(SECTION_RETURN_CLUE, expandedSection).iterateNext();
    returnButton.click();
  } else {
    sectionInformation = scrapVisibleSection(section);
  }
  return sectionInformation;
};
var scrapProfile = async () => {
  await loadPageContent();
  let fullname = document.getElementsByTagName("h1")[0].textContent;
  let workExperience = await scrapSection("experience");
  let education = await scrapSection("education");
  let port = chrome.runtime.connect({ name: "safePort" });
  port.postMessage(new Person(fullname, workExperience, education));
};
await scrapProfile();
