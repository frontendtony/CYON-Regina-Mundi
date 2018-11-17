const mongoose = require('mongoose');

const CommitteeSchema = new mongoose.Schema({
	title: {
    type:String,
    lowercase: true,
    unique: true,
    required: true 
  },
	purpose: { 
    type:String,
    lowercase: true,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
	chairman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
	members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
	meetingSchedule: {
    type: String,
    lowercase: true
  },
	startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
});

module.exports = mongoose.model('Committee', CommitteeSchema);