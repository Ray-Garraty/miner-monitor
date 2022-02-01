import _ from 'lodash';

// const testValues = (new Array(114)).fill(null).map((n, i) => i + 1).join(';');
const chunkSize = 3;

export default (name, values) => {
  const valuesArray = values.split(';');
  const chunkedArray = _.chunk(valuesArray, chunkSize);
  const [rightArray, leftArray] = _.chunk(chunkedArray, chunkedArray.length/2)
    .map((chunk, i) => i === 1 ? chunk.reverse() : chunk)
    .map((chunk) => chunk.map((chunk, i) => (i + 1) % 2 === 0 ? chunk.reverse() : chunk));
  const result = _.zip(leftArray, rightArray)
    .map((chunk) => chunk.flat())
    .map((values) => [name, values.join(';')]);
  // console.log('На выходе splitPVT: ', result);
  return result;
};
