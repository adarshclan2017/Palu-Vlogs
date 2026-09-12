const dataStore = require('../services/dataStore');

// @desc    Submit contact form message
// @route   POST /api/contact
// @access  Public
const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields (name, email, subject, message)'
      });
    }

    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const newMessage = await dataStore.createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: newMessage
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
const getMessages = async (req, res, next) => {
  try {
    const messages = await dataStore.getContactMessages();
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle message read status
// @route   PUT /api/contact/:id/read
// @access  Private (Admin)
const toggleReadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await dataStore.toggleMessageRead(id);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deleteContactMessage(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  toggleReadStatus,
  deleteMessage
};
