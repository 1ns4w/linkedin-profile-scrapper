import { Person } from "./modules/models/Person";
import { WorkExperience } from "./modules/models/Work";
import { WorkPosition } from "./modules/models/Position";
import { loadPageContent } from "./modules/utils/autoscroll";
import { xpathEval } from "./modules/utils/xpath"
import { cleanText} from "./modules/utils/cleantext"

const scrapProfile = async () => {

    await loadPageContent();
    let fullname = document.getElementsByTagName("h1")[0].textContent
    let workSections = xpathEval("(//section[.//span[contains(text(), 'Experiencia')]]//ul)[1]/li[.//a[@data-field='experience_company_logo']][//ul[count(li) > 1]]", document)
    let workSectionsIterator = workSections.iterateNext();
    let workExperiences = []

    while (workSectionsIterator) {

        let isWorkHistory = xpathEval("(.)[.//span[@class = 'pvs-entity__path-node']]", workSectionsIterator)
        let isWorkHistoryIterator = isWorkHistory?.iterateNext();

        if (isWorkHistoryIterator) {
            
            while (isWorkHistoryIterator) {
            
            let company = cleanText(xpathEval(".//a[@data-field='experience_company_logo'][./span]/div/span/span[1]", isWorkHistoryIterator).iterateNext().textContent)
            let totalDuration = cleanText(xpathEval(".//a[@data-field='experience_company_logo'][./span]/span/span[1]", isWorkHistoryIterator).iterateNext().textContent)

            let workPositions = []

            workExperiences.push(new WorkExperience(company, totalDuration, workPositions))
            isWorkHistoryIterator = isWorkHistory.iterateNext();

            }
        }

        else {
            let experienceData = xpathEval("./div/div[2]/div/div[1][./*]", workSectionsIterator).iterateNext();
            let workPosition = cleanText(xpathEval("./div//span[@aria-hidden]", experienceData).iterateNext().textContent);
            let company = cleanText(xpathEval("./span[1]//span[@aria-hidden]", experienceData).iterateNext().textContent);
            let duration = cleanText(xpathEval("./span[2]//span[@aria-hidden]", experienceData).iterateNext().textContent);
            workExperiences.push(new WorkExperience(company, duration, workPosition));
        }

        workSectionsIterator = workSections.iterateNext();
    }

    let port = chrome.runtime.connect({name:'safePort'});
    port.postMessage(new Person(fullname, workExperiences));
}

scrapProfile();