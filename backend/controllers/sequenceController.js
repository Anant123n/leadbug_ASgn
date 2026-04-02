const Sequence = require('../models/Sequence');

// Simulated scheduling logic
const scheduleMessages = (sequence) => {
  const delay = sequence.scheduleType === 'immediately'
    ? 500
    : Math.max(0, new Date(sequence.scheduledAt) - Date.now());

  setTimeout(async () => {
    try {
      await Sequence.findByIdAndUpdate(sequence._id, {
        status: 'Running',
        'stats.attempted': sequence.recipients?.length || 10,
      });

      // Simulate completion after 3 seconds
      setTimeout(async () => {
        const delivered = Math.floor(Math.random() * 30) + 60; // 60-90%
        const sent = Math.min(delivered + Math.floor(Math.random() * 10), 100);
        await Sequence.findByIdAndUpdate(sequence._id, {
          status: 'Completed',
          'stats.sent': sent,
          'stats.delivered': delivered,
        });
      }, 3000);
    } catch (e) {
      console.error('Scheduler error:', e);
    }
  }, delay);
};

// GET /api/sequences
const getSequences = async (req, res) => {
  try {
    const sequences = await Sequence.find().sort({ createdAt: -1 });
    res.json({ success: true, data: sequences, total: sequences.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/sequences
const createSequence = async (req, res) => {
  try {
    const seqData = req.body;
    seqData.status = seqData.scheduleType === 'immediately' ? 'Scheduled' : 'Scheduled';
    const sequence = new Sequence(seqData);
    await sequence.save();

    // Kick off simulated scheduling
    scheduleMessages(sequence);

    res.status(201).json({ success: true, data: sequence });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/sequences/:id - toggle active / update status
const updateSequence = async (req, res) => {
  try {
    const updated = await Sequence.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/sequences/:id
const deleteSequence = async (req, res) => {
  try {
    await Sequence.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Sequence deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSequences, createSequence, updateSequence, deleteSequence };
