const Contact = require('../models/Contact');

// GET /api/contacts
const getContacts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: contacts, total: contacts.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/contacts
const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/contacts/seed — add demo contacts
const seedContacts = async (req, res) => {
  try {
    const exists = await Contact.countDocuments();
    if (exists > 0) return res.json({ success: true, message: 'Already seeded' });

    const demoContacts = Array.from({ length: 12 }, (_, i) => ({
      name: `Website Development ${i + 1}`,
      phone: `+91 9876543${String(i).padStart(3, '0')}`,
      email: `contact${i + 1}@gmail.com`,
      source: i % 3 === 0 ? 'Google Leads' : 'WhatsApp',
      listName: i % 2 === 0 ? 'Google Leads List' : 'Peoples Data',
      createdAt: new Date('2025-11-25'),
    }));

    await Contact.insertMany(demoContacts);
    res.json({ success: true, message: 'Contacts seeded', count: demoContacts.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/contacts/:id
const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/contacts/lists — get distinct list names for sequence builder
const getContactLists = async (req, res) => {
  try {
    const lists = await Contact.aggregate([
      { $group: { _id: '$listName', count: { $sum: 1 }, lastModified: { $max: '$createdAt' }, source: { $first: '$source' } } },
      { $project: { _id: 0, name: '$_id', count: 1, lastModified: 1, source: 1 } },
    ]);
    res.json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getContacts, createContact, seedContacts, deleteContact, getContactLists };
