import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, updateUserRole, deleteUser, getAdminStats } from '../services/adminService';
import StatsCard from '../components/admin/StatsCard';
import UsersTable from '../components/admin/UsersTable';
import { Users, BookOpen, GraduationCap, Shield, UserCheck, Video, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        if (user?.role !== 'ADMIN') {
            toast.error('Access denied. Admin only.');
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, statsData] = await Promise.all([
                getAllUsers(),
                getAdminStats()
            ]);
            setUsers(usersData);
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to load admin dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            toast.success('User role updated successfully');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data || 'Failed to update role');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }
        
        try {
            await deleteUser(userId);
            toast.success('User deleted successfully');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data || 'Failed to delete user');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const statsCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
        { title: 'Students', value: stats?.totalStudents || 0, icon: GraduationCap, color: 'bg-green-500' },
        { title: 'Instructors', value: stats?.totalInstructors || 0, icon: UserCheck, color: 'bg-purple-500' },
        { title: 'Admins', value: stats?.totalAdmins || 0, icon: Shield, color: 'bg-red-500' },
        { title: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'bg-yellow-500' },
        { title: 'Total Lectures', value: stats?.totalLectures || 0, icon: Video, color: 'bg-indigo-500' },
        { title: 'Total Enrollments', value: stats?.totalEnrollments || 0, icon: Users, color: 'bg-pink-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
            >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl text-white p-8 mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-purple-100">
                    Manage users, courses, and monitor platform statistics
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>

            {/* Users Management Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b p-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Management
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage user roles and permissions. Admin users cannot be modified.
                    </p>
                </div>
                <div className="p-6">
                    <UsersTable
                        users={users}
                        onRoleUpdate={handleRoleUpdate}
                        onDelete={handleDeleteUser}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;