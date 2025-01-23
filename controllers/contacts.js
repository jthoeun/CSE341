const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('contacts').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({ error: 'An error occurred while retrieving contacts' });
  }
};

const getSingle = async (req, res, next) => {
  try {
    const userId = req.params.id.trim(); 
    console.log('Received userId:', userId);

    if (!ObjectId.isValid(userId)) {
      console.error('Invalid ObjectId format:', userId);
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const objectId = new ObjectId(userId);
    console.log('Converted to ObjectId:', objectId);

    const db = mongodb.getDb().db();
    console.log('Using database:', db.databaseName);

    const result = await db.collection('contacts').findOne({ _id: objectId });
    console.log('Query result:', result);

    if (!result) {
      console.error('Contact not found for ID:', objectId);
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getSingle:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the contact' });
  }
};

const createContact = async (req, res) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDb().db().collection('contacts').insertOne(contact);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
};

const updateContact = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('contacts')
    .replaceOne({ _id: userId }, contact);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
};

const deleteContact = async (req, res) => {
  try {
    const userId = req.params.id.trim();

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const objectId = new ObjectId(userId);
    const response = await mongodb.getDb().db().collection('contacts').deleteOne({ _id: objectId });

    if (response.deletedCount > 0) {
      console.log('Contact deleted successfully');
      res.status(204).send(); // Successfully deleted
    } else {
      res.status(404).json({ error: 'Contact not found' }); // No document matched the provided ID
    }
  } catch (error) {
    console.error('Error in deleteContact:', error);
    res.status(500).json({ error: 'An error occurred while deleting the contact' });
  }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };