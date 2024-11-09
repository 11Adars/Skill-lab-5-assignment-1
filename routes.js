const express = require('express');
const router = express.Router();
const { ComplaintQueue, ComplaintStack } = require('./complaints');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const queue = new ComplaintQueue();
const stack = new ComplaintStack();

// CSV Writer Setup
const csvWriter = createCsvWriter({
  path: 'data.csv',
  header: [
    { id: 'id', title: 'ID' },
    { id: 'description', title: 'Description' },
    { id: 'priority', title: 'Priority' },
    { id: 'status', title: 'Status' }
  ]
});

// Add Complaint
router.post('/complaints', (req, res) => {
  const { id, description, priority } = req.body;
  queue.addComplaint({ id, description, priority, status: 'Pending' });
  res.status(201).json({ message: 'Complaint added to queue' });
});

// Process Complaint
router.post('/complaints/process', (req, res) => {
  if (queue.isEmpty()) {
    return res.status(400).json({ message: 'No complaints to process' });
  }
  const complaint = queue.processComplaint();
  complaint.status = 'Resolved';
  stack.addResolvedComplaint(complaint);
  res.status(200).json({ message: 'Complaint processed', complaint });
});

// Revert Last Complaint
router.post('/complaints/revert', (req, res) => {
  const reverted = stack.revertLastComplaint();
  if (!reverted) {
    return res.status(400).json({ message: 'No complaints to revert' });
  }
  res.status(200).json({ message: 'Complaint reverted', reverted });
});

// Export to CSV
router.get('/complaints/export', async (req, res) => {
  const data = stack.stack.map((complaint, index) => ({
    id: index + 1,
    description: complaint.description,
    priority: complaint.priority,
    status: complaint.status
  }));

  try {
    await csvWriter.writeRecords(data);
    res.status(200).json({ message: 'Data exported to data.csv' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to export data', error });
  }
});

module.exports = router;
