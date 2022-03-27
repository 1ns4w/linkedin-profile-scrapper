import { Person } from "./modules/models/Person";
import { Work } from "./modules/models/Work";
import { XPath } from "./modules/utils/xpath"

const scrollPage = async (seconds) => {
    while (true) {
        let pageHeight = document.body.scrollHeight;
        window.scrollTo({top: pageHeight, behavior: "smooth"});
        await new Promise(r => setTimeout(r, seconds * 1000));
        if (pageHeight === document.body.scrollHeight) {
            window.scrollTo({top: 0, behavior: "smooth"});
            break
        }
    }
}

scrollPage(5);

let fullname = document.getElementsByTagName("h1")[0].textContent
let workExperience = []
console.log(fullname, workExperience)

/*let workSection = XPath("(//section[.//span[contains(text(), 'Experiencia')]]//ul)[1]", document).iterateNext();
let port = chrome.runtime.connect({name:'safePort'});
port.postMessage(fullname, workExperience);*/