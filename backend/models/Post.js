import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    rewrittenTitle: {
      type: String,
      required: true,
      trim: true,
    },
    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    primaryKeyword: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Latest Jobs', 'Admit Cards', 'Results', 'Answer Key', 'Syllabus', 'Admission'],
      index: true,
    },
    sourceUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    organizationName: {
      type: String,
      default: '',
    },
    postName: {
      type: String,
      default: '',
    },
    totalVacancies: {
      type: String,
      default: 'N/A',
    },
    postDate: {
      type: String,
      default: '',
    },
    shortInfo: {
      type: String,
      default: '',
    },
    rewrittenContent: {
      type: String,
      default: '',
    },
    importantDates: [
      {
        eventName: { type: String, required: true },
        dateValue: { type: String, required: true },
      },
    ],
    applicationFee: [
      {
        category: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
    ageLimit: {
      minAge: { type: String, default: '' },
      maxAge: { type: String, default: '' },
      asOnDate: { type: String, default: '' },
      relaxationInfo: { type: String, default: '' },
    },
    vacanciesTable: [
      {
        postName: { type: String, default: 'General / Various' },
        totalPost: { type: String, default: 'N/A' },
        eligibility: { type: String, default: '' },
      },
    ],
    howToApply: [
      {
        type: String,
      },
    ],
    importantLinks: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    isIndexed: {
      type: Boolean,
      default: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helper static method for duplicate check
postSchema.statics.isDuplicateUrl = async function (sourceUrl) {
  const existing = await this.findOne({ sourceUrl: sourceUrl.trim() }).select('_id').lean();
  return !!existing;
};

export const Post = mongoose.model('Post', postSchema);
