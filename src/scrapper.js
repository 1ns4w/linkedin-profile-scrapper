import { Person } from "./modules/models/Person";
import { WorkExperience } from "./modules/models/Work";
import { loadPageContent } from "./modules/utils/autoscroll";
import { xpathEval } from "./modules/utils/xpath"
import { cleanText} from "./modules/utils/cleantext"
import { 
        XPATH_HISTORY_WORK_EXPERIENCE_COMPANY_OR_POSITION,
        XPATH_HISTORY_WORK_EXPERIENCE_DURATION_INFO,
        XPATH_SECTION, XPATH_WORK_EXPERIENCE_COMPANY,
        XPATH_WORK_EXPERIENCE_CONTAINERS,
        XPATH_WORK_EXPERIENCE_DROPDOWN_CLUE, 
        PATH_WORK_EXPERIENCE_DURATION_INFO,
        XPATH_WORK_EXPERIENCE_HISTORY_CLUE,
        XPATH_WORK_EXPERIENCE_POSITION,
        XPATH_WORK_EXPERIENCE_RETURN_CLUE
       } from "../config/env";

const findSection = (sectionName) => {
    return xpathEval(XPATH_SECTION(sectionName), document).iterateNext();
}

const scrapExperienceSection = () => {
    
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

const scrapProfile = async () => {

    await loadPageContent();

    let fullname = document.getElementsByTagName("h1")[0].textContent
    let workExperiences;

    let workSection = findSection("experience")
    let workSectionDropdown = xpathEval(XPATH_WORK_EXPERIENCE_DROPDOWN_CLUE, workSection).iterateNext()

    if (workSectionDropdown) {
        workSectionDropdown.click();
        await new Promise(r => setTimeout(r, 8000));
        workExperiences = scrapExperienceSection();
        await new Promise(r => setTimeout(r, 8000));
        let returnButton = xpathEval(XPATH_WORK_EXPERIENCE_RETURN_CLUE, document).iterateNext();
        returnButton.click();
    }

    else {
        workExperiences = scrapExperienceSection();
    }

    let port = chrome.runtime.connect({name:'safePort'});
    port.postMessage(new Person(fullname, workExperiences));
}

scrapProfile();
