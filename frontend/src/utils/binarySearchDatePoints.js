import { formatDate } from "./dateFormatter";
export const binarySearchDatePoints = (arr, target) => {
  let index = 0
  let lowPoint = 0;
  let highPoint = arr.length - 1
  const date = formatDate(target)
  while (lowPoint <= highPoint) {
    let midElement = Math.floor((lowPoint + highPoint) / 2);
    if (date === arr[midElement].date) {
      index = midElement
      return index
    } else if (date < arr[midElement].date) {
      highPoint = midElement - 1
    } else {
      lowPoint = midElement + 1
    }
  }
}
