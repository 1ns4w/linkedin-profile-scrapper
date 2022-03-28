import { Person } from "./modules/models/Person";
import { WorkExperience } from "./modules/models/Work";
import { loadPageContent } from "./modules/utils/autoscroll";
import { xpathEval } from "./modules/utils/xpath"
import { cleanText} from "./modules/utils/cleantext"

const findSection = (sectionName) => {
    return xpathEval(`//section[./div[@id="${sectionName}"]]/div[3]`, document).iterateNext();
}

const scrapExperienceSection = () => {
    
    let worksIterator = xpathEval("(//section[.//span[contains(text(), 'Experiencia')] or .//h2[contains(@class, 't-20')]]//ul)[1]/li[.//a[contains(@href, 'company') or contains(@href, 'linkedin.com/search')]]//div[contains(@class, 'pvs-entity') and count(./div) = 2 and not(.//span[contains(@class, 'pvs-entity__path-node')])]", document)
    let thisWork = worksIterator.iterateNext();

    let workExperiences = []

    while (thisWork) {

        let thisWorkHistory = xpathEval("(.)/../../../../../../../../../div[1][./a]", thisWork).iterateNext();

        if (thisWorkHistory) {
            
            let company = cleanText(xpathEval(".//span[contains(@class, 't-bold')]/span[@aria-hidden]", thisWorkHistory).iterateNext().textContent)
            let position = cleanText(xpathEval(".//span[contains(@class, 't-bold')]/span[@aria-hidden]", thisWork).iterateNext().textContent)
            let durationInfo = cleanText(xpathEval(".//span[contains(@class, 't-normal')]/span[@aria-hidden]", thisWork).iterateNext().textContent).split(' · ');
            let totalDuration = durationInfo[1]
            let durationRange = durationInfo[0].split(' - ')
            let startDate = durationRange[0]
            let endDate = durationRange[durationRange.length - 1]

            workExperiences.push(new WorkExperience(company, position, totalDuration, startDate, endDate))
            console.log(position);
        }

        else {
            let company = cleanText(xpathEval("", thisWork).iterateNext().textContent)
            let position = cleanText(xpathEval("", thisWork).iterateNext().textContent)
            let durationInfo = cleanText(xpathEval("", thisWork).iterateNext().textContent).split(' · ');
            let totalDuration = durationInfo[1]
            let durationRange = durationInfo[0].split(' - ')
            let startDate = durationRange[0]
            let endDate = durationRange[durationRange.length - 1]

            workExperiences.push(new WorkExperience(company, position, totalDuration, startDate, endDate))
            console.log(position);
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
    let workSectionDropdown = xpathEval("./div/a", workSection).iterateNext()

    if (workSectionDropdown) {
        workSectionDropdown.click();
        await new Promise(r => setTimeout(r, 8000));
        workExperiences = scrapExperienceSection();
        await new Promise(r => setTimeout(r, 8000));
        let returnButton = xpathEval("//button[contains(@aria-label, 'Volver')]", document).iterateNext();
        returnButton.click();
    }

    else {
        workExperiences = scrapExperienceSection();
    }

    let port = chrome.runtime.connect({name:'safePort'});
    port.postMessage(new Person(fullname, workExperiences));
}

scrapProfile();