/**
 * @param {number[]} original
 * @param {number} m
 * @param {number} n
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

console.log(construct2DArray([1, 2, 3], 1, 3));
