import { Contact } from "../models/contact.js";

export const getAllContacts = (filter = {}, query = {}) =>
  Contact.find(filter).skip(query.skip).limit(query.limit);
export const getOneContactById = (id) => Contact.findById(id);
export const getOneContact = (filter) => Contact.findOne(filter);

export const deleteContactById = (id) => Contact.findByIdAndDelete(id);
export const deleteContact = (filter) => Contact.findOneAndDelete(filter);
export const createContact = (data) => Contact.create(data);
export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });
export const updateContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data, { new: true });
