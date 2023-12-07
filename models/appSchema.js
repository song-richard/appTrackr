const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    applicationDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['Applied', 'In Progress', 'Interviewed', 'Offered', 'Rejected'],
        default: 'Applied',
    },
    notes: {
        type: String,
    },
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
