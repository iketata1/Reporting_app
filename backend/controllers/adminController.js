const User = require('../models/User');
const Report = require('../models/Report');

// Get all users with their report counts
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Get report counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const reportCount = await Report.countDocuments({ createdBy: user._id });
        return {
          ...user.toObject(),
          reportCount
        };
      })
    );

    res.json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get all reports (admin view)
exports.getAllReportsAdmin = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

// Get reports by user
exports.getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reports = await Report.find({ createdBy: userId })
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    const user = await User.findById(userId).select('-password');

    res.json({
      success: true,
      user,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ message: 'Error fetching user reports', error: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalReports = await Report.countDocuments();
    
    const reportsByStatus = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReports = await Report.find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalReports,
        reportsByStatus: reportsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      recentUsers,
      recentReports
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Don't allow deleting yourself
    if (userId === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
