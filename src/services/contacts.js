import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  ownerId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactCollection.find({ ownerId });
  // const contactCount = await ContactCollection.countDocuments(contactQuery);

  // const contacts = await contactQuery.skip(skip).limit(perPage);
  if (filter.favourite) {
    contactQuery.where('isFavourite').equals(filter.favourite);
  }

  if (filter.type) {
    contactQuery.where('contactType').equals(filter.type);
  }

  const [contactCount, contacts] = await Promise.all([
    ContactCollection.countDocuments(contactQuery),
    contactQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const totalPages = Math.ceil(contactCount / perPage);

  return {
    data: contacts,
    page,
    perPage,
    contactCount,
    totalPages,
    hasNextPage: totalPages - page > 0,
    hasPreviousPage: page > 1,
  };
};

export const getContactById = async (id) => {
  const contact = await ContactCollection.findById(id);
  return contact;
};

// export const getContactById = async (id, ownerId) => {
//   const contact = await ContactCollection.findOne({
//     _id: id,
//     ownerId: ownerId,
//   });
//   return contact;
// };

export const createContact = async (payload) => {
  const contacts = await ContactCollection.create(payload);
  return contacts;
};

export const updateContact = async (id, contact) => {
  const rawResult = await ContactCollection.findByIdAndUpdate(id, contact, {
    new: true,
  });
  return rawResult;
};

export const deleteContact = async (id) => {
  const contact = await ContactCollection.findOneAndDelete({ _id: id });
  return contact;
};
