const parseIsFavourite = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  const parsedBool = JSON.parse(value);

  if (parsedBool !== true) {
    return;
  }
  return parsedBool;

  // if ([false, true].includes(parsedBool) !== true) {
  //   return;
  // }
  // return parsedBool;

  // const isString = typeof value === 'string';
  // if (!isString) return;

  // const isType = (value) => [false | true].includes(value);
  // if (isType(value)) return value;
};

const parseContactType = (value) => {
  // if (typeof value != 'string') {
  //   return undefined;
  // }

  const isString = typeof value === 'string';
  if (!isString) return;

  const isContactType = (value) => ['work', 'home', 'personal'].includes(value);
  if (isContactType(value)) return value;
};

export const parseFilterParams = (query) => {
  const { favourite, type } = query;

  const parseFavourite = parseIsFavourite(favourite);

  const parseType = parseContactType(type);

  return {
    favourite: parseFavourite,
    type: parseType,
  };
};
