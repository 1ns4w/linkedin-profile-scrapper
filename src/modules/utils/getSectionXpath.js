export const getSectionXPath = (sectionName) => {
    return `//section[./div[@id="${sectionName}"]]/div[3]`;
}