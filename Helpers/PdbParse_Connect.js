const regex = /^CONECT(:?\s*\d+.+)+/gm;
const regexMatchdigit = /(:?\d+s*)/gm;
const getConnect = (str) => {
  let array = [];
  let a = [];
  let grp = str.matchAll(regex);
  for (const match of grp) {
    a = [];
    let matches = match[1].matchAll(regexMatchdigit);
    for (const match of matches) a.push(match[0]);

    if (a.length > 0) array.push(a);
  }
  return array;
};
module.exports = getConnect;
