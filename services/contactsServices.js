import { Contact } from "../models/contact.js";

export const getAllContacts = (filter = {}, query = {}) =>
  Contact.find(filter).skip(query.skip).limit(query.limit);
export const getOneContact = (id) => Contact.findById(id);
export const deleteContact = (id) => Contact.findByIdAndDelete(id);
export const createContact = (data) => Contact.create(data);
export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });
