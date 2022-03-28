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

// src/modules/utils/cleantext.js
var cleanText = (text) => {
  return text.match(/[^\s|\n]+/ig).join(" ");
};

// src/scrapper.js
var scrapProfile = async () => {
  await loadPageContent();
  let fullname = document.getElementsByTagName("h1")[0].textContent;
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
      let company = cleanText(xpathEval("./div//span[@aria-hidden]", experienceData).iterateNext().textContent);
      let workPosition = cleanText(xpathEval("./span[1]//span[@aria-hidden]", experienceData).iterateNext().textContent);
      let duration = cleanText(xpathEval("./span[2]//span[@aria-hidden]", experienceData).iterateNext().textContent);
      workExperiences.push(new WorkExperience(company, duration, workPosition));
    }
    workSectionsIterator = workSections.iterateNext();
  }
  let port = chrome.runtime.connect({ name: "safePort" });
  port.postMessage(new Person(fullname, workExperiences));
};
scrapProfile();
