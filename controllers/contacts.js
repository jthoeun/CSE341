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

module.exports = { getAll, getSingle };