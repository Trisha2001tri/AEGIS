// backend/src/controllers/dashboard.controller.js

import Message from '../models/message.model.js';

// ======================================================
// SYSTEM OVERVIEW + DISTRIBUTION
// ======================================================

export const getSystemStats = async (req, res, next) => {
  try {
    const totalMessages = await Message.countDocuments();

    const processed = await Message.countDocuments({
      status: 'PROCESSED',
    });

    const failed = await Message.countDocuments({
      status: 'FAILED',
    });

    const escalated = await Message.countDocuments({
      action: 'ESCALATE',
    });

    const highRisk = await Message.countDocuments({
      risk: 'HIGH',
    });

    // ======================================================
    // SENTIMENT / RESULT DISTRIBUTION
    // ======================================================

    const rawIntentDistribution = await Message.aggregate([
      {
        $match: {
          result: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$result',
          count: { $sum: 1 },
        },
      },
    ]);

    // Clean frontend-friendly response
    const intentDistribution = rawIntentDistribution.map((item) => ({
      sentiment: item._id,
      count: item.count,
    }));

    res.status(200).json({
      success: true,

      overview: {
        totalMessages,
        processed,
        failed,
        escalated,
        highRisk,
      },

      intents: intentDistribution,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// RECENT CONVERSATIONS
// ======================================================

export const getRecentConversations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const items = await Message.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments();

    res.status(200).json({
      success: true,

      data: items,

      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// RISK TRENDS
// ======================================================

export const getRiskTrends = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trends = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },

          highRiskCount: {
            $sum: {
              $cond: [{ $eq: ['$risk', 'HIGH'] }, 1, 0],
            },
          },

          totalCount: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // Clean frontend-friendly response
    const formattedTrends = trends.map((item) => ({
      date: item._id,
      highRiskCount: item.highRiskCount,
      totalCount: item.totalCount,
    }));

    res.status(200).json({
      success: true,
      trends: formattedTrends,
    });
  } catch (error) {
    next(error);
  }
};