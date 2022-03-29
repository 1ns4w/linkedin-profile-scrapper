export const SECTION_DROPDOWN_CLUE = "./div/a";
export const SECTION_RETURN_CLUE = "//button[contains(@aria-label, 'Volver')]";
export const SECTION_ITEMS = `(.//ul)[1]/li[.//a[contains(@href, 'company') or contains(@href, 'linkedin.com/search')]]//div[contains(@class, 'pvs-entity') and count(./div) = 2 and not(.//span[contains(@class, 'pvs-entity__path-node')])]`;