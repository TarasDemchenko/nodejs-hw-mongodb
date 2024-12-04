const parseSortBy = (value) => {
  if (typeof value !== 'string') {
    return '_id';
  }

  const keysOfContact = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
  ];

  if (keysOfContact.includes(value) !== true) {
    return '_id';
  }
  return value;
};

const parseSortOrder = (value) => {
  if (typeof value !== 'string') {
    return 'asc';
  }
  if (['asc', 'desc'].includes(value) !== true) {
    return 'asc';
  }
  return value;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
