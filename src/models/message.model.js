import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 AI output (raw understanding)
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: null,
    },

    // 🔹 Risk layer (derived from sentiment + history)
    risk: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: null,
      index: true,
    },

    confidence: {
      type: Number,
      default: null,
    },

    // 🔹 Decision engine output
    action: {
      type: String,
      enum: ['NONE', 'JOURNAL', 'GROUNDING', 'ESCALATE', 'CLARIFY'],
      default: 'NONE',
    },

    // 🔹 Debug / explainability
    decision_reason: {
      type: String,
      default: null,
    },

    // 🔹 Track progression (history-based intelligence)
    risk_trend: {
      type: String,
      enum: ['STABLE', 'INCREASING', 'DECREASING'],
      default: 'STABLE',
    },

    // 🔹 Async lifecycle
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },

    result: {
      type: String, // keeping for backward compatibility
      default: null,
    },

    tracking_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;