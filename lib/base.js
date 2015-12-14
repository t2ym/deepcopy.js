import { copy, copyCollection, copyValue } from './copy';

function defaultCustomizer(target) {
  return void 0;
}

function deepcopy(target, customizer = defaultCustomizer) {
  if (target === null) {
    // copy null
    return null;
  }

  const resultValue = copyValue(target);

  if (resultValue !== null) {
    // copy some primitive types
    return resultValue;
  }

  const resultCollection = copyCollection(target, customizer),
        clone = (resultCollection !== null) ? resultCollection : target;

  const visited = [target],
        reference = [clone];

  // recursively copy from collection
  return recursiveCopy(target, customizer, clone, visited, reference);
}

function recursiveCopy(target, customizer, clone, visited, reference) {
  if (target === null) {
    // copy null
    return null;
  }

  const resultValue = copyValue(target);

  if (resultValue !== null) {
    // copy some primitive types
    return resultValue;
  }

  // TODO: concat symbols
  const keys = Object.keys(target);

  let i, len;

  let key, value, index, result, resultCopy, ref;

  for (i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    value = target[key];
    // TODO: polyfill
    index = visited.indexOf(value);

    if (index === -1) {
      resultCopy = copy(value, customizer);
      result = (resultCopy !== null) ? resultCopy : value;

      visited.push(value);
      reference.push(result);
    } else {
      // circular reference
      ref = reference[index];
    }

    clone[key] = ref || recursiveCopy(value, customizer, result, visited, reference);
  }

  return clone;
}

export default {
  deepcopy,
  recursiveCopy,
};