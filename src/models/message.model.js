import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      default: 'anonymous_user',
    },

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

    // AI output
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: null,
    },

    // Risk layer
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

    // Decision engine
    action: {
      type: String,
      enum: ['NONE', 'JOURNAL', 'GROUNDING', 'ESCALATE', 'CLARIFY'],
      default: 'NONE',
    },

    // Explainability
    decision_reason: {
      type: String,
      default: null,
    },

    // Historical progression
    risk_trend: {
      type: String,
      enum: ['STABLE', 'INCREASING', 'DECREASING'],
      default: 'STABLE',
    },

    // Queue lifecycle
    status: {
      type: String,
      enum: [
        'PENDING',
        'PROCESSING',
        'RETRYING',
        'PROCESSED',
        'FAILED',
        'AI_FAILED_FALLBACK_USED',
      ],
      default: 'PENDING',
      index: true,
    },

    // Retry metadata
    retry_count: {
      type: Number,
      default: 0,
    },

    // Operational monitoring
    system_note: {
      type: String,
      default: null,
    },

    last_error: {
      type: String,
      default: null,
    },

    // Backward compatibility
    result: {
      type: String,
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