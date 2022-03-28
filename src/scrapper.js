import { Person } from "./modules/models/Person";
import { WorkExperience } from "./modules/models/Work";
import { WorkPosition } from "./modules/models/Position";
import { loadPageContent } from "./modules/utils/autoscroll";
import { xpathEval } from "./modules/utils/xpath"

const scrapProfile = async () => {

    await loadPageContent();
    let fullname = document.getElementsByTagName("h1")[0].textContent
    let workSections = xpathEval("(//section[.//span[contains(text(), 'Experiencia')]]//ul)[1]/li[.//a[@data-field='experience_company_logo']]", document)
    let workSectionsIterator = workSections.iterateNext();

    let workExperiences = []

    while (workSectionsIterator) {

        let isWorkHistory = xpathEval("[.//ul[count(li) > 1]]", workSectionsIterator)
        let isWorkHistoryIterator = isWorkHistory.iterateNext();

        if (isWorkHistoryIterator) {

            let company = xpathEval("//a[@data-field='experience_company_logo'][./span]/div", isWorkHistoryIterator).iterateNext().textContent
            let totalDuration = xpathEval("//a[@data-field='experience_company_logo'][./span]/span/span[1]", isWorkHistoryIterator).iterateNext().textContent

            // positions

            let workPositions = []

            workExperiences.push(new WorkExperience(company, totalDuration, workPositions))
        }
    }

    let port = chrome.runtime.connect({name:'safePort'});
    port.postMessage(new Person(fullname, workExperiences));
}

scrapProfile();