import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import path from 'node:path';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsepaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import fs from 'node:fs/promises';
import { uploadCloudinary } from '../utils/uploadToCloudinary.js';
export const getContactsController = async (req, res, next) => {
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const { page, perPage } = parsePaginationParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactControllerById = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id, req.user.id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  // if (contact.ownerId.toString() !== req.user.id.toString()) {
  //   throw createHttpError(404, 'Contact not found');
  // }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

// export const createContactController = async (req, res) => {
//   const contact = {
//     name: req.body.name,
//     phoneNumber: req.body.phoneNumber,
//     email: req.body.email,
//   };

//   const result = await createContact(contact);
//   console.log(result);
//   res.send('hello');
// };

export const createContactController = async (req, res) => {
  let photo = null;

  if (typeof req.file !== 'undefined') {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'avatars', req.file.filename),
      );
      photo = `http://localhost:3000/photo/${req.file.filename}`;
    }
  }
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    userId: req.user.id,
    photo,
  };

  const result = await createContact(contact);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: result,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const result = await updateContact(id, req.user.id, req.body);

  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.send({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;

  const result = await deleteContact(id, req.user.id);

  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(204).send({
    status: 204,
    message: `Contact deleted!`,
  });
};
