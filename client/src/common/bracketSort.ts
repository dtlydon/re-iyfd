export const tournySort = (matchUps: any[]) => {
  if (matchUps.length % 2 !== 0) return matchUps;

  const higher = [...matchUps];
  const lower = higher.splice(0, higher.length / 2);
  higher.reverse()
  const sorted = [];
  while (higher.length > 0 && lower.length > 0) {
    sorted.push(lower.shift())
    sorted.push(higher.shift())
    if (higher.length > 0 && lower.length > 0) {
      higher.reverse()
      lower.reverse()
      sorted.push(higher.shift())
      sorted.push(lower.shift())
    }
  }
  return sorted;
}

// tournySort([1,2,3,4,5,6,7,8])
// tournySort([1,2,3,4])
// tournySort([1,2])

/*
1 8 5 4 3 6 7 2

// start
1 2 3 4 5 6 7 8
// split into 2 and reverse second
1 2 3 4
8 7 6 5
// take item 11, item 21
2 3 4
7 6 5
r - 1 8
// reverse and take 21 - 11
3 2
6 7
r - 1 8 5 4
// take item 11, item 21
2
7
r - 1 8 5 4 3 6
// revers and take 21 - 11
r - 1 8 5 4 3 6 7 2
*/
