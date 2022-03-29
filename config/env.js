export const XPATH_WORK_EXPERIENCE_CONTAINERS = "(//section[.//span[contains(text(), 'Experiencia')] or .//h2[contains(@class, 't-20')]]//ul)[1]/li[.//a[contains(@href, 'company') or contains(@href, 'linkedin.com/search')]]//div[contains(@class, 'pvs-entity') and count(./div) = 2 and not(.//span[contains(@class, 'pvs-entity__path-node')])]";
export const XPATH_WORK_EXPERIENCE_HISTORY_CLUE = "(.)/../../../../../../../../../div[1][./a]";
export const XPATH_HISTORY_WORK_EXPERIENCE_COMPANY_OR_POSITION = ".//span[contains(@class, 't-bold')]/span[@aria-hidden]"
export const XPATH_HISTORY_WORK_EXPERIENCE_DURATION_INFO = ".//span[contains(@class, 't-normal')]/span[@aria-hidden]"
export const XPATH_WORK_EXPERIENCE_COMPANY = "(.//span[contains(@class, 't-normal')]/span[@aria-hidden])[1]"
export const XPATH_WORK_EXPERIENCE_POSITION = ".//span[contains(@class, 't-bold')]/span[@aria-hidden]"
export const XPATH_WORK_EXPERIENCE_DURATION_INFO = "(.//span[contains(@class, 't-normal')]/span[@aria-hidden])[2]"
export const SECTION_RETURN_CLUE = "//button[contains(@aria-label, 'Volver')]"
export const SECTION_DROPDOWN_CLUE = "./div/a"