const User = require("../../models/User.model");

exports.getInsights = async (req, res) => {
  try {
    if (!req.user._id)
      return res.status(200).json({
        success: false,
        message: "user._id not found",
      });
    const insights = await User.aggregate([
      {
        $match: { _id: req.user._id },
      },
      {
        $project: { firstName: 1, lastName: 1, email: 1 },
      },
      // Department insights
      {
        $lookup: {
          from: "departments",
          pipeline: [
            // Get total count
            {
              $facet: {
                total: [{ $count: "count" }],
                active: [{ $match: { status: true } }, { $count: "count" }],
                inactive: [{ $match: { status: false } }, { $count: "count" }],
              },
            },
            // Format the output
            {
              $project: {
                total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
                active: {
                  $ifNull: [{ $arrayElemAt: ["$active.count", 0] }, 0],
                },
                inactive: {
                  $ifNull: [{ $arrayElemAt: ["$inactive.count", 0] }, 0],
                },
              },
            },
          ],
          as: "departmentInsights",
        },
      },
      // Employee insights
      {
        $lookup: {
          from: "employees",
          pipeline: [
            {
              $facet: {
                total: [{ $count: "count" }],
              },
            },
            {
              $project: {
                total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
              },
            },
          ],
          as: "employeeInsights",
        },
      },
      // Task insights
      {
        $lookup: {
          from: "tasks",
          pipeline: [
            {
              $facet: {
                total: [{ $count: "count" }],
                done: [{ $match: { status: "Done" } }, { $count: "count" }],
                pending: [
                  { $match: { status: "Pending" } },
                  { $count: "count" },
                ],
                delayed: [
                  { $match: { status: "Delayed" } },
                  { $count: "count" },
                ],
                high: [{ $match: { priority: "High" } }, { $count: "count" }],
                mid: [{ $match: { priority: "Mid" } }, { $count: "count" }],
                low: [{ $match: { priority: "Low" } }, { $count: "count" }],
              },
            },
            {
              $project: {
                total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
                status: {
                  done: {
                    $ifNull: [{ $arrayElemAt: ["$done.count", 0] }, 0],
                  },
                  pending: {
                    $ifNull: [{ $arrayElemAt: ["$pending.count", 0] }, 0],
                  },
                  delayed: {
                    $ifNull: [{ $arrayElemAt: ["$delayed.count", 0] }, 0],
                  },
                },
                priority: {
                  high: {
                    $ifNull: [{ $arrayElemAt: ["$high.count", 0] }, 0],
                  },
                  mid: {
                    $ifNull: [{ $arrayElemAt: ["$mid.count", 0] }, 0],
                  },
                  low: {
                    $ifNull: [{ $arrayElemAt: ["$low.count", 0] }, 0],
                  },
                },
              },
            },
          ],
          as: "taskInsights",
        },
      },
      // Format the final output
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          accountType: 1,
          departmentInsights: { $arrayElemAt: ["$departmentInsights", 0] },
          employeeInsights: { $arrayElemAt: ["$employeeInsights", 0] },
          taskInsights: { $arrayElemAt: ["$taskInsights", 0] },
        },
      },
    ]);
    if (!insights) {
      console.log("Insights fetch failed");
    }
    return res.status(200).json({
      success: true,
      message: "Insights Fetched successfully",
      data: insights[0],
    });
  } catch (error) {
    console.log("Error while fetching insights ", error.message);
    return res.status(501).json({
      success: false,
      message: "Unable to get insights",
      error: error.message,
    });
  }
};
