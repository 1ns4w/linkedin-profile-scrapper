// src/scrapper.js
var scrollPage = async () => {
  while (true) {
    let pageHeight = document.body.scrollHeight;
    console.log(pageHeight);
    window.scrollTo(0, pageHeight);
    await new Promise((r) => setTimeout(r, 5e3));
    if (pageHeight === document.body.scrollHeight) {
      console.log("Bye world");
      break;
    }
  }
};
scrollPage();
