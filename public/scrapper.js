// src/modules/models/Person.js
var Person = class {
  constructor(name, workExperience) {
    this.name = name;
    this.workExperience = workExperience;
  }
};

// src/modules/models/Work.js
var WorkExperience = class {
  constructor(company, totalDuration, workPositions) {
    this.company = company;
    this.totalDuration = totalDuration;
    this.workPositions = workPositions;
  }
};

// src/modules/models/Position.js
var WorkPosition = class {
  constructor(position, duration, startDate, endDate, description) {
    this.position = position;
    this.duration = duration;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
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
  let workSections = xpathEval("(//section[.//span[contains(text(), 'Experiencia')]]//ul)[1]/li[.//a[@data-field='experience_company_logo']][//ul[count(li) > 1]]", document);
  let workSectionsIterator = workSections.iterateNext();
  let workExperiences = [];
  while (workSectionsIterator) {
    let isWorkHistory = xpathEval("(.)[.//span[@class = 'pvs-entity__path-node']]", workSectionsIterator);
    let isWorkHistoryIterator = isWorkHistory?.iterateNext();
    if (isWorkHistoryIterator) {
      while (isWorkHistoryIterator) {
        let company = cleanText(xpathEval(".//a[@data-field='experience_company_logo'][./span]/div/span/span[1]", isWorkHistoryIterator).iterateNext().textContent);
        let totalDuration = cleanText(xpathEval(".//a[@data-field='experience_company_logo'][./span]/span/span[1]", isWorkHistoryIterator).iterateNext().textContent);
        let workPositions = [];
        workExperiences.push(new WorkExperience(company, totalDuration, workPositions));
        isWorkHistoryIterator = isWorkHistory.iterateNext();
      }
    } else {
      let experienceData = xpathEval("./div/div[2]/div/div[1][./*]", workSectionsIterator).iterateNext();
      let company = cleanText(xpathEval("./span[1]//span[@aria-hidden]", experienceData).iterateNext().textContent);
      let durationData = cleanText(xpathEval("./span[2]//span[@aria-hidden]", experienceData).iterateNext().textContent).split(" \xB7 ");
      let totalDuration = durationData[durationData.length - 1];
      let workPositionName = cleanText(xpathEval("./div//span[@aria-hidden]", experienceData).iterateNext().textContent);
      let dateRange = durationData[0].split(" - ");
      let startDate = dateRange[0];
      let endDate = dateRange[dateRange.length - 1];
      let workPosition = new WorkPosition(workPositionName, totalDuration, startDate, endDate);
      workExperiences.push(new WorkExperience(company, totalDuration, [workPosition]));
    }
    workSectionsIterator = workSections.iterateNext();
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
    let returnButton = xpathEval("//button[contains(@aria-label, 'Volver')]", document).iterateNext();
    returnButton.click();
  } else {
    workExperiences = scrapExperienceSection();
  }
  let port = chrome.runtime.connect({ name: "safePort" });
  port.postMessage(new Person(fullname, workExperiences));
};
scrapProfile();
