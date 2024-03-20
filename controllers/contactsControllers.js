import * as contactsService from "../services/contactsServices.js";
import { controllersWrapper } from "../decorators/controllersWrapper.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = controllersWrapper(async (req, res, next) => {
  const { page = 1, limit = 20, favorite = null } = req.query;
  const skip = (page - 1) * limit;
  const { _id: owner } = req.user;
  const filter = favorite === null ? { owner } : { favorite, owner };
  const result = await contactsService.getAllContacts(filter, { skip, limit });
  res.json(result);
});

export const getOneContact = controllersWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  console.log(owner);
  const { id } = req.params;
  const result = await contactsService.getOneContact({ _id: id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const deleteContact = controllersWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.deleteContact({ _id: id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const createContact = controllersWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await contactsService.createContact({ ...req.body, owner });
  res.status(201).json(result);
});

export const updateContact = controllersWrapper(async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name & !email && !phone) {
    throw HttpError(400, "Body must have at least one field");
  }
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.updateContact(
    { _id: id, owner },
    req.body
  );

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const updateStatusContact = controllersWrapper(
  async (req, res, next) => {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const result = await contactsService.updateContact(
      { _id: id, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  }
);
