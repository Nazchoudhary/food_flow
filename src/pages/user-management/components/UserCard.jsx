import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserCard = ({ user, onEdit, onResetPassword, onToggleStatus, onDelete, currentUserId }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-muted-foreground bg-muted';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin':
        return 'text-primary bg-primary/10';
      case 'admin':
        return 'text-secondary bg-secondary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const isCurrentUser = user.id === currentUserId;
  const canDelete = !isCurrentUser && user.role !== 'superadmin';

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* User Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
            {user.role}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {user.status}
          </span>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Created:</span>
          <p className="font-medium text-foreground">{formatDate(user.createdAt)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Last Login:</span>
          <p className="font-medium text-foreground">{formatLastLogin(user.lastLogin)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          iconName="Edit"
          iconPosition="left"
          onClick={() => onEdit(user)}
        >
          Edit
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Key"
          iconPosition="left"
          onClick={() => onResetPassword(user)}
        >
          Reset Password
        </Button>
        
        <Button
          variant={user.status === 'active' ? 'warning' : 'success'}
          size="sm"
          iconName={user.status === 'active' ? 'UserX' : 'UserCheck'}
          iconPosition="left"
          onClick={() => onToggleStatus(user)}
        >
          {user.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
        
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            iconName="Trash2"
            iconPosition="left"
            onClick={() => onDelete(user)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCard;