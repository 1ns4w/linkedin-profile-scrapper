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

// src/scrapper.js
var scrapProfile = async () => {
  await loadPageContent();
  let fullname = document.getElementsByTagName("h1")[0].textContent;
  let workSections = xpathEval("(//section[.//span[contains(text(), 'Experiencia')]]//ul)[1]/li[.//a[@data-field='experience_company_logo']]", document);
  let workSectionsIterator = workSections.iterateNext();
  let workExperiences = [];
  while (workSectionsIterator) {
    let isWorkHistory = xpathEval("[.//ul[count(li) > 1]]", workSectionsIterator);
    let isWorkHistoryIterator = isWorkHistory.iterateNext();
    if (isWorkHistoryIterator) {
      let company = xpathEval("//a[@data-field='experience_company_logo'][./span]/div", isWorkHistoryIterator).iterateNext().textContent;
      let totalDuration = xpathEval("//a[@data-field='experience_company_logo'][./span]/span/span[1]", isWorkHistoryIterator).iterateNext().textContent;
      let workPositions = [];
      workExperiences.push(new WorkExperience(company, totalDuration, workPositions));
    }
  }
  let port = chrome.runtime.connect({ name: "safePort" });
  port.postMessage(new Person(fullname, workExperiences));
};
scrapProfile();
