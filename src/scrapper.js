import { Person } from "./modules/models/Person";
import { WorkExperience } from "./modules/models/Work";
import { loadPageContent } from "./modules/utils/autoscroll";
import { evaluateXPath } from "./modules/utils/evaluateXPath"
import { cleanText} from "./modules/utils/cleantext"
import { getSectionXPath } from "./modules/utils/getSectionXpath";
import { SECTION_DROPDOWN_CLUE, SECTION_RETURN_CLUE } from "./modules/helpers/XPathConstants";

const findSection = (sectionClue) => {
    return evaluateXPath(getSectionXPath(sectionClue), document).iterateNext();
}

const scrapVisibleSection = (section) => {
    
    let worksIterator = xpathEval(XPATH_WORK_EXPERIENCE_CONTAINERS, document)
    let thisWork = worksIterator.iterateNext();

    let workExperiences = []

    while (thisWork) {

        let thisWorkHistory = xpathEval(XPATH_WORK_EXPERIENCE_HISTORY_CLUE, thisWork).iterateNext();

        if (thisWorkHistory) {
            
            let company = cleanText(xpathEval(XPATH_HISTORY_WORK_EXPERIENCE_COMPANY_OR_POSITION, thisWorkHistory).iterateNext().textContent)
            let position = cleanText(xpathEval(XPATH_HISTORY_WORK_EXPERIENCE_COMPANY_OR_POSITION, thisWork).iterateNext().textContent)
            let durationInfo = cleanText(xpathEval(XPATH_HISTORY_WORK_EXPERIENCE_DURATION_INFO, thisWork).iterateNext().textContent).split(' · ');
            let totalDuration = durationInfo[1]
            let durationRange = durationInfo[0].split(' - ')
            let startDate = durationRange[0]
            let endDate = durationRange[durationRange.length - 1]

            workExperiences.push(new WorkExperience(company, position, totalDuration, startDate, endDate))
        }

        else {
            let company = cleanText(xpathEval(XPATH_WORK_EXPERIENCE_COMPANY, thisWork).iterateNext().textContent)
            let position = cleanText(xpathEval(XPATH_WORK_EXPERIENCE_POSITION, thisWork).iterateNext().textContent)
            let durationInfo = cleanText(xpathEval(XPATH_WORK_EXPERIENCE_DURATION_INFO, thisWork).iterateNext().textContent).split(' · ');
            let totalDuration = durationInfo[1]
            let durationRange = durationInfo[0].split(' - ')
            let startDate = durationRange[0]
            let endDate = durationRange[durationRange.length - 1]

            workExperiences.push(new WorkExperience(company, position, totalDuration, startDate, endDate))
        }

        thisWork = worksIterator.iterateNext();
    }
    return workExperiences;
}

const scrapSection = async (section) => {

    let sectionInformation;
    let sectionDropdown = evaluateXPath(SECTION_DROPDOWN_CLUE, section).iterateNext()

    if (sectionDropdown) {
        sectionDropdown.click();
        await sleep(8);
        sectionInformation = scrapVisibleSection(section);
        await sleep(8);
        let returnButton = xpathEval(SECTION_RETURN_CLUE, document).iterateNext();
        returnButton.click();
    }

    else {
        sectionInformation = scrapVisibleSection(section);
    }

    return sectionInformation;
}

const scrapProfile = async () => {

    await loadPageContent();

    let fullname = document.getElementsByTagName("h1")[0].textContent
    let workSection = findSection("experience")
    let educationSection = findSection("education")

    let workExperience = scrapSection(workSection);
    let education = scrapSection(educationSection);

    let port = chrome.runtime.connect({name:'safePort'});
    port.postMessage(new Person(fullname, workExperience));
}

scrapProfile();