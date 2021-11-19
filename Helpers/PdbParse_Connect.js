const regex = /^CONECT(:?\s*\d+.+)+/gm;
const regexMatchdigit = /(:?\d+s*)/gm;
const getConnect = (grp) => {
  let array = [];
  for (let i = 0; i < grp.length; i++) {
    array.push(grp[i][1]?.match(regexMatchdigit));
  }
  return array;
};
const mapAtoms = (Atoms) => {
  console.log(Atoms.length);
  let max = { x: Atoms[0]?.x, y: Atoms[0]?.y, z: Atoms[0]?.z };
  let min = { x: Atoms[0]?.x, y: Atoms[0]?.y, z: Atoms[0]?.z };
  for (let i = 0; i < Atoms.length; i++) {
    if (max.x < Atoms[i].x) max.x = Atoms[i].x;
    if (max.y < Atoms[i].y) max.y = Atoms[i].y;
    if (max.z < Atoms[i].z) max.z = Atoms[i].z;
    if (min.x > Atoms[i].x) min.x = Atoms[i].x;
    if (min.y > Atoms[i].y) min.y = Atoms[i].y;
    if (min.z > Atoms[i].z) min.z = Atoms[i].z;
  }
  let diff = { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z };
  for (let i = 0; i < Atoms.length; i++) {
    Atoms[i].x = Atoms[i].x - min.x - diff.x / 2;
    Atoms[i].y = Atoms[i].y - min.y - diff.y / 2;
    Atoms[i].z = Atoms[i].z - min.z - diff.z / 2;
  }
  return Atoms;
};
module.exports = { getConnect, mapAtoms };
