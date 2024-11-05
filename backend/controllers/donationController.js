const Donation = require('../models/Donation');

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create({
      donor: req.user.id,
      ...req.body,
      transactionId: 'TXN_' + Date.now()
    });

    res.status(201).json({
      success: true,
      donation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .sort('-createdAt');

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};