import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStats = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const superAdmins = users.filter(user => user.role === 'superadmin').length;
  const admins = users.filter(user => user.role === 'admin').length;

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: 'Users',
      color: 'text-primary bg-primary/10'
    },
    {
      label: 'Active Users',
      value: activeUsers,
      icon: 'UserCheck',
      color: 'text-success bg-success/10'
    },
    {
      label: 'Super Admins',
      value: superAdmins,
      icon: 'Shield',
      color: 'text-accent bg-accent/10'
    },
    {
      label: 'Admins',
      value: admins,
      icon: 'User',
      color: 'text-secondary bg-secondary/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
              <Icon name={stat.icon} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;