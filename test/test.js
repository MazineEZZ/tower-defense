/**
 * @param {number[]} original
 * @param {number} rows
 * @param {number} cols
 * @return {number[][]}
 */
var construct2DArray = function (original, rows, cols) {
  let arr = [];
  let ctr = 0;
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push(original[ctr]);
      ctr++;
    }
    arr.push(row);
  }
  return arr;
};

function hasObject(arr, obj) {
  return arr.some((el) => {
    for (const prop in el) {
      const elKeys = Object.keys(el);
      const objKeys = Object.keys(obj);

      if (elKeys.length !== objKeys.length) return false;

      return elKeys.every((key) => el[key] === obj[key]);
    }
    return true;
  });
}

const array = [
  {
    row: 2,
    col: 3,
  },
];
const row = 2;
const col = 3;

console.log(hasObject(array, { row, col }));
