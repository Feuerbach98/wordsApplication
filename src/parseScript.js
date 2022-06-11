const classname = "study__text__I-4Vx";
const mediaClass = "study__media__1Qdgw"

const arr = Array.from(document.getElementsByClassName(classname));

const result = [];

const mediaarr = Array.from(document.getElementsByClassName(mediaClass));

arr.forEach((el,i) => {
  console.log()
  result.push({
    word: el.children[0].innerText.trim().toLowerCase(),
    translation: el.children[1].innerText.replace("-", "").trim(),
    soundName: mediaarr[i].firstChild.firstChild.firstChild.src.split("/").slice(-1)[0]
  })

  setTimeout(() => {
    const dlAnchorElem = document.createElement("a");
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.setAttribute("href", mediaarr[i].firstChild.firstChild.firstChild.src);
    dlAnchorElem.setAttribute("download", "");
    dlAnchorElem.click();
  }, 1000 * i)
})

console.log(JSON.stringify(result));


