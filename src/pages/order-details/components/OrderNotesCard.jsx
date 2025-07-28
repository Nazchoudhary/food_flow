import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const OrderNotesCard = ({ order, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsAdding(true);
    try {
      await onAddNote(order.id, newNote.trim());
      setNewNote('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Order Notes</h3>
      
      {/* Existing Notes */}
      <div className="space-y-3 mb-4">
        {order.notes && order.notes.length > 0 ? (
          order.notes.map((note, index) => (
            <div key={index} className="bg-muted rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{note.content}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">{note.author}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <Icon name="MessageSquare" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notes added yet</p>
          </div>
        )}
      </div>
      
      {/* Add New Note */}
      <div className="border-t border-border pt-4">
        <div className="space-y-3">
          <Input
            label="Add Note"
            type="text"
            placeholder="Enter order note or special instructions..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-2"
          />
          <Button
            variant="outline"
            fullWidth
            iconName="Plus"
            iconPosition="left"
            loading={isAdding}
            disabled={!newNote.trim()}
            onClick={handleAddNote}
          >
            {isAdding ? 'Adding...' : 'Add Note'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderNotesCard;