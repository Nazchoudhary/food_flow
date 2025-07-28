import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserStats from './components/UserStats';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import UserCard from './components/UserCard';
import AddUserModal from './components/AddUserModal';
import EditUserModal from './components/EditUserModal';
import ConfirmationModal from './components/ConfirmationModal';
import { usersAPI } from '../../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: '',
    user: null,
    title: '',
    message: '',
    confirmText: '',
    variant: 'destructive'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [error, setError] = useState(null);

  // Mock current user ID (in real app, this would come from auth context)
  const currentUserId = 1;

  // Load users data
  useEffect(() => {
    const loadUsersData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const usersResponse = await usersAPI.getUsers();
        setUsers(usersResponse);
      } catch (error) {
        console.error('Failed to load users data:', error);
        setError('Failed to load users data. Please check your connection and try again.');
        
        // Fallback to empty array if API fails
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsersData();
  }, []);

  useEffect(() => {
    // Filter users based on search term, role, and status
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleAddUser = async (userData) => {
    try {
      const newUser = await usersAPI.addUser(userData);
      setUsers(prev => [...prev, newUser]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add user:', error);
      setError('Failed to add user. Please try again.');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await usersAPI.updateUser(updatedUser.id, updatedUser);
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleResetPassword = (user) => {
    setConfirmationModal({
      isOpen: true,
      type: 'resetPassword',
      user,
      title: 'Reset Password',
      message: `Are you sure you want to reset the password for ${user.name}? A new temporary password will be sent to their email address.`,
      confirmText: 'Reset Password',
      variant: 'warning'
    });
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    
    setConfirmationModal({
      isOpen: true,
      type: 'toggleStatus',
      user,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} ${user.name}? This will ${newStatus === 'active' ? 'restore' : 'remove'} their access to the system.`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      variant: newStatus === 'active' ? 'success' : 'warning'
    });
  };

  const handleDeleteUser = (user) => {
    setConfirmationModal({
      isOpen: true,
      type: 'deleteUser',
      user,
      title: 'Delete User',
      message: `Are you sure you want to permanently delete ${user.name}? This action cannot be undone and will remove all associated data.`,
      confirmText: 'Delete User',
      variant: 'destructive'
    });
  };

  const handleConfirmAction = async () => {
    const { type, user } = confirmationModal;
    setIsLoading(true);

    try {
      switch (type) {
        case 'resetPassword':
          // In real app, this would trigger password reset email
          console.log(`Password reset for ${user.email}`);
          break;
        
        case 'toggleStatus':
          const newStatus = user.status === 'active' ? 'inactive' : 'active';
          await usersAPI.updateUser(user.id, { ...user, status: newStatus });
          setUsers(prev => prev.map(u => 
            u.id === user.id ? { ...u, status: newStatus } : u
          ));
          break;
        
        case 'deleteUser':
          await usersAPI.deleteUser(user.id);
          setUsers(prev => prev.filter(u => u.id !== user.id));
          break;
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setError('Failed to perform action. Please try again.');
    } finally {
      setIsLoading(false);
      setConfirmationModal({ 
        isOpen: false, 
        type: '', 
        user: null, 
        title: '', 
        message: '', 
        confirmText: '', 
        variant: 'destructive' 
      });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-0 md:ml-60 pt-16 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-0 md:ml-60 pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />
          
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-destructive hover:text-destructive/80 text-sm underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage admin users and their permissions</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="hidden md:flex items-center space-x-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <Icon name="Table" size={16} />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  <Icon name="Grid3X3" size={16} />
                </Button>
              </div>
              
              <Button
                onClick={() => setIsAddModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Add New Admin
              </Button>
            </div>
          </div>

          {/* Stats */}
          <UserStats users={users} />

          {/* Filters */}
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Users List */}
          {viewMode === 'table' ? (
            <UserTable
              users={filteredUsers}
              onEdit={handleEditUser}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteUser}
              currentUserId={currentUserId}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onResetPassword={handleResetPassword}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteUser}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}

          {filteredUsers.length === 0 && !isLoading && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Users Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ?
                  'No users match your current search criteria.' :
                  'Get started by adding your first admin user.'
                }
              </p>
              {(!searchTerm && roleFilter === 'all' && statusFilter === 'all') && (
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add New Admin
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        variant={confirmationModal.variant}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserManagement;
