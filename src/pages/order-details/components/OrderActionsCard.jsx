import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OrderActionsCard = ({ order, onGenerateBill, onSendToWhatsApp, onMarkAsPaid }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleGenerateBill = async () => {
    setIsGenerating(true);
    try {
      await onGenerateBill(order.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToWhatsApp = async () => {
    setIsSending(true);
    try {
      await onSendToWhatsApp(order.id);
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkAsPaid = () => {
    setShowConfirmDialog(true);
  };

  const confirmMarkAsPaid = async () => {
    try {
      await onMarkAsPaid(order.id);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Failed to mark as paid:', error);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Order Actions</h3>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            iconName="FileText"
            iconPosition="left"
            loading={isGenerating}
            onClick={handleGenerateBill}
          >
            {isGenerating ? 'Generating...' : 'Generate Bill'}
          </Button>
          
          <Button
            variant="secondary"
            fullWidth
            iconName="MessageCircle"
            iconPosition="left"
            loading={isSending}
            onClick={handleSendToWhatsApp}
          >
            {isSending ? 'Sending...' : 'Send to WhatsApp'}
          </Button>
          
          {order.paymentStatus !== 'paid' && (
            <Button
              variant="success"
              fullWidth
              iconName="CheckCircle"
              iconPosition="left"
              onClick={handleMarkAsPaid}
            >
              Mark as Paid
            </Button>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Last updated: {new Date(order.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1300]">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-modal">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Payment</h3>
                <p className="text-sm text-muted-foreground">Mark this order as paid?</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              This action will update the payment status to "Paid" and cannot be undone easily. 
              Please ensure payment has been received before confirming.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                fullWidth
                onClick={confirmMarkAsPaid}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderActionsCard;