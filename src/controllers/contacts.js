import { getAllContacts, getContactById } from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactControllerById = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    res.status(404).json({
      message: 'Contact not found',
    });
    return;
  }
  res.send({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};
