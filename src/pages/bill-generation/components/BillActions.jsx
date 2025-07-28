import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BillActions = ({ billData, onGenerateBill, onCopyBill, onSendWhatsApp, onMarkPaid }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleGenerateBill = async () => {
    setIsGenerating(true);
    try {
      await onGenerateBill();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyBill = async () => {
    setIsCopying(true);
    try {
      await onCopyBill();
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } finally {
      setIsCopying(false);
    }
  };

  const handleSendWhatsApp = async () => {
    setIsSending(true);
    try {
      await onSendWhatsApp();
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkPaid = async () => {
    setIsMarkingPaid(true);
    try {
      await onMarkPaid();
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const isDisabled = !billData;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Bill Actions</h3>

      <div className="space-y-4">
        {/* Generate Bill */}
        <Button
          variant="default"
          fullWidth
          onClick={handleGenerateBill}
          disabled={isDisabled}
          loading={isGenerating}
          iconName="FileText"
          iconPosition="left"
        >
          Generate Bill Text
        </Button>

        {/* Copy to Clipboard */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleCopyBill}
          disabled={isDisabled}
          loading={isCopying}
          iconName={copySuccess ? "Check" : "Copy"}
          iconPosition="left"
        >
          {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
        </Button>

        {/* Send via WhatsApp */}
        <Button
          variant="success"
          fullWidth
          onClick={handleSendWhatsApp}
          disabled={isDisabled}
          loading={isSending}
          iconName={sendSuccess ? "Check" : "MessageCircle"}
          iconPosition="left"
        >
          {sendSuccess ? 'Sent Successfully!' : 'Send via WhatsApp'}
        </Button>

        {/* Mark as Paid */}
        {billData && !billData.billing.isPaid && (
          <Button
            variant="warning"
            fullWidth
            onClick={handleMarkPaid}
            loading={isMarkingPaid}
            iconName="CreditCard"
            iconPosition="left"
          >
            Mark as Paid
          </Button>
        )}

        {/* Payment Status */}
        {billData && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Status:</span>
              <div className="flex items-center space-x-2">
                {billData.billing.isPaid ? (
                  <>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">Paid</span>
                  </>
                ) : (
                  <>
                    <Icon name="Clock" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-warning">Pending</span>
                  </>
                )}
              </div>
            </div>
            
            {billData.billing.paymentMethod && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Payment Method:</span>
                <span className="text-sm font-medium text-foreground">
                  {billData.billing.paymentMethod}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Information */}
      {billData && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Customer Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium text-foreground">{billData.customer.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">WhatsApp:</span>
              <span className="font-medium text-foreground">{billData.customer.whatsapp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Table:</span>
              <span className="font-medium text-foreground">#{billData.customer.tableNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order Time:</span>
              <span className="font-medium text-foreground">
                {new Date(billData.createdAt).toLocaleTimeString('en-US')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillActions;