const Template = require('../models/Template');

// GET /api/templates
const getTemplates = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }
    const templates = await Template.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: templates, total: templates.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/templates
const createTemplate = async (req, res) => {
  try {
    const templateData = req.body;
    // Extract variables from body text e.g. {{1}}, {{2}}, {{name}}
    const variableMatches = (templateData.body || '').match(/\{\{[^}]+\}\}/g) || [];
    templateData.variables = [...new Set(variableMatches)];

    const template = new Template(templateData);
    await template.save();
    res.status(201).json({ success: true, data: template });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/templates/:id
const deleteTemplate = async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/templates/:id
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTemplates, createTemplate, deleteTemplate, getTemplateById };
