import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactCollection.findById(id);
  return contact;
};

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
