import * as contactsService from "../services/contactsServices.js";
import { controllersWrapper } from "../decorators/controllersWrapper.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = controllersWrapper(async (req, res, next) => {
  const { page = 1, limit = 20, favorite = null } = req.query;
  const skip = (page - 1) * limit;
  const filter = favorite === null ? {} : { favorite };
  const result = await contactsService.getAllContacts(filter, { skip, limit });
  res.json(result);
});

export const getOneContact = controllersWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.getOneContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const deleteContact = controllersWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.deleteContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const createContact = controllersWrapper(async (req, res, next) => {
  const result = await contactsService.createContact(req.body);
  res.status(201).json(result);
});

export const updateContact = controllersWrapper(async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name & !email && !phone) {
    throw HttpError(400, "Body must have at least one field");
  }
  const { id } = req.params;
  const result = await contactsService.updateContact(id, req.body);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const updateStatusContact = controllersWrapper(
  async (req, res, next) => {
    const { id } = req.params;
    const { favorite } = req.body;
    if (!favorite) {
      throw HttpError(400, "You don't pass a favorite status ");
    }
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  }
);
