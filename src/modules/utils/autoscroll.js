export const loadPageContent = async (seconds = 5) => {
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