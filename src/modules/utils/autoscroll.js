export const loadPageContent = async (loadingDelaySeconds = 5) => {
    while (true) {
        let previousScrollHeight = document.documentElement.scrollHeight;
        window.scrollTo({top: pageHeight, behavior: "smooth"});
        await new Promise(r => setTimeout(r, loadingDelaySeconds * 1000));
        if (previousScrollHeight === document.documentElement.scrollHeight) {
            window.scrollTo({top: 0, behavior: "smooth"});
            break
        }
    }
}