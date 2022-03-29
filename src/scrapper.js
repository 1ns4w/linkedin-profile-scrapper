import { Person } from "./modules/models/Person";
import { WorkExperience } from "./modules/models/Work";
import { loadPageContent } from "./modules/utils/autoscroll";
import { evaluateXPath } from "./modules/utils/evaluateXPath"
import { cleanText} from "./modules/utils/cleantext"
import { getSectionXPath } from "./modules/utils/getSectionXpath";
import { sleep } from "./modules/utils/sleep";
import { SECTION_DROPDOWN_CLUE, SECTION_ITEMS, SECTION_ITEM_COMPANY, SECTION_ITEM_DURATION_INFO, SECTION_ITEM_HISTORY_CLUE, SECTION_ITEM_POSITION, SECTION_ITEM_WITH_HISTORY_COMPANY_OR_POSITION, SECTION_ITEM_WITH_HISTORY_DURATION_INFO, SECTION_RETURN_CLUE } from "./modules/helpers/XPathConstants";

const findSection = (sectionClue) => {
    return evaluateXPath(getSectionXPath(sectionClue), document).iterateNext();
}

const scrapVisibleSection = async (section) => {
    
    let sectionItemsIterator = evaluateXPath(SECTION_ITEMS, section)
    let thisSectionItem = sectionItemsIterator.iterateNext();

    let itemsInformation = []

    while (thisSectionItem) {

        let thisSectionItemHistory = evaluateXPath(SECTION_ITEM_HISTORY_CLUE, thisSectionItem).iterateNext();

        if (thisSectionItemHistory) {
            
            let company = cleanText(evaluateXPath(SECTION_ITEM_WITH_HISTORY_COMPANY_OR_POSITION, thisSectionItemHistory).iterateNext().textContent)
            let position = cleanText(evaluateXPath(SECTION_ITEM_WITH_HISTORY_COMPANY_OR_POSITION, thisSectionItem).iterateNext().textContent)
            let durationInfo = cleanText(evaluateXPath(SECTION_ITEM_WITH_HISTORY_DURATION_INFO, thisSectionItem).iterateNext().textContent).split(' · ');
            let totalDuration = durationInfo[1]
            let durationRange = durationInfo[0].split(' - ')
            let startDate = durationRange[0]
            let endDate = durationRange[durationRange.length - 1]

            itemsInformation.push(new WorkExperience(company, position, totalDuration, startDate, endDate))
        }

        else {
            let company = cleanText(evaluateXPath(SECTION_ITEM_COMPANY, thisSectionItem).iterateNext().textContent)
            let position = cleanText(evaluateXPath(SECTION_ITEM_POSITION, thisSectionItem).iterateNext().textContent)
            let durationInfo = cleanText(evaluateXPath(SECTION_ITEM_DURATION_INFO, thisSectionItem).iterateNext().textContent).split(' · ');
            let totalDuration = durationInfo[1]
            let durationRange = durationInfo[0].split(' - ')
            let startDate = durationRange[0]
            let endDate = durationRange[durationRange.length - 1]

            itemsInformation.push(new WorkExperience(company, position, totalDuration, startDate, endDate))
        }

        thisSectionItem = sectionItemsIterator.iterateNext();
    }
    return itemsInformation;
}

const scrapSection = async (sectionName) => {

    let sectionInformation;
    let section = findSection(sectionName);
    let sectionDropdown = evaluateXPath(SECTION_DROPDOWN_CLUE, section).iterateNext()

    if (sectionDropdown) {
        sectionDropdown.click();
        await sleep(8);
        console.log("sleep1")
        let expandedSection = findSection(sectionName);
        sectionInformation = await scrapVisibleSection(expandedSection);
        let returnButton = evaluateXPath(SECTION_RETURN_CLUE, expandedSection).iterateNext();
        returnButton.click();
        await sleep(4);
        console.log("sleep2")
    }

    else {
        sectionInformation = scrapVisibleSection(section);
    }
    return sectionInformation;
}

const scrapProfile = async () => {

    await loadPageContent();

    let fullname = document.getElementsByTagName("h1")[0].textContent;
    let workExperience = await scrapSection("experience");
    let education = await scrapSection("education");
    let volunteeringExperience = await scrapSection("volunteering_experience");

    let port = chrome.runtime.connect({name:'safePort'});
    port.postMessage(new Person(fullname, workExperience, education, volunteeringExperience));
}

scrapProfile();