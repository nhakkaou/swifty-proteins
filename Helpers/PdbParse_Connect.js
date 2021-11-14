const regex = /^CONECT(:?\s*\d+.+)+/gm;
const regexMatchdigit = /(:?\d+s*)/gm;
const getConnect = (grp) => {
  let array = [];
  for (let i = 0; i < grp.length; i++) {
    array.push(grp[i][1]?.match(regexMatchdigit));
  }
  return array;
};
module.exports = getConnect;
