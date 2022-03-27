import { Person } from "./modules/models/Person";
import { Work } from "./modules/models/Work";
import { XPath } from "./modules/utils/xpath"

const scrollPage = async () => {
    while (true) {
        let pageHeight = document.body.scrollHeight;
        console.log(pageHeight)
        window.scrollTo(0, pageHeight);
        await new Promise(r => setTimeout(r, 5000));
        if (pageHeight === document.body.scrollHeight) {
            console.log("Bye world")
            break
        }
    }
}

scrollPage();

/*
let fullname = document.getElementsByTagName("h1")[0].textContent
let workSection = XPath("(//section[.//span[contains(text(), 'Experiencia')]]//ul)[1]", document).iterateNext();
let workExperience = []

console.log(fullname, workSection)
let port = chrome.runtime.connect({name:'safePort'});
port.postMessage(fullname, workExperience);*/