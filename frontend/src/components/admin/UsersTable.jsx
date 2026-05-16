import React, { useState } from 'react';
import { Edit, Trash2, Save, X, UserCog } from 'lucide-react';

const UsersTable = ({ users, onRoleUpdate, onDelete, loading }) => {
    const [editingId, setEditingId] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');

    const handleEdit = (user) => {
        setEditingId(user.id);
        setSelectedRole(user.role);
    };

    const handleSave = (userId) => {
        onRoleUpdate(userId, selectedRole);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setSelectedRole('');
    };

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'ADMIN': return 'bg-red-100 text-red-800';
            case 'INSTRUCTOR': return 'bg-green-100 text-green-800';
            case 'STUDENT': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                Loading...
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                No users found
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingId === user.id ? (
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="px-2 py-1 border rounded text-sm"
                                        >
                                            <option value="STUDENT">Student</option>
                                            <option value="INSTRUCTOR">Instructor</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.role === 'INSTRUCTOR' ? (
                                        <span>{user.createdCoursesCount || 0} created</span>
                                    ) : (
                                        <span>{user.enrolledCoursesCount || 0} enrolled</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {editingId === user.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSave(user.id)}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                <Save className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                                disabled={user.role === 'ADMIN'}
                                            >
                                                <UserCog className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(user.id, user.fullName)}
                                                className="text-red-600 hover:text-red-900"
                                                disabled={user.role === 'ADMIN'}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;