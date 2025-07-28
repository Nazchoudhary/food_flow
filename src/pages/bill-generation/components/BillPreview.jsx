import React from 'react';
import Icon from '../../../components/AppIcon';

const BillPreview = ({ billData, isGenerating }) => {
  const formatBillText = () => {
    if (!billData) return '';
    
    const { restaurant, order, customer, billing } = billData;
    
    return `
═══════════════════════════
    ${restaurant.name}
═══════════════════════════
${restaurant.address}
Phone: ${restaurant.phone}
GST: ${restaurant.gst}

Date: ${new Date().toLocaleDateString('en-US')}
Time: ${new Date().toLocaleTimeString('en-US')}
Bill No: ${billing.billNumber}
Table: ${customer.tableNumber}
Customer: ${customer.name}

═══════════════════════════
           ORDER DETAILS
═══════════════════════════

${order.items.map(item => 
  `${item.name.padEnd(20)} x${item.quantity}\n$${item.price.toFixed(2).padStart(8)} = $${(item.price * item.quantity).toFixed(2).padStart(8)}`
).join('\n')}

───────────────────────────
Subtotal:        $${billing.subtotal.toFixed(2).padStart(8)}
Tax (${billing.taxRate}%):         $${billing.tax.toFixed(2).padStart(8)}
${billing.discount > 0 ? `Discount:        -$${billing.discount.toFixed(2).padStart(7)}\n` : ''}${billing.serviceCharge > 0 ? `Service Fee:     $${billing.serviceCharge.toFixed(2).padStart(8)}\n` : ''}───────────────────────────
TOTAL:           $${billing.total.toFixed(2).padStart(8)}

═══════════════════════════
Payment Status: ${billing.isPaid ? 'PAID' : 'PENDING'}
Payment Method: ${billing.paymentMethod || 'N/A'}

Thank you for dining with us!
Visit us again soon!
═══════════════════════════`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Bill Preview</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Receipt" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">WhatsApp Format</span>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 mb-4">
        <div className="bg-white rounded border p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-muted-foreground">Generating bill...</span>
              </div>
            </div>
          ) : billData ? (
            formatBillText()
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="FileText" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Select an order to generate bill preview</p>
            </div>
          )}
        </div>
      </div>

      {billData && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Bill Number:</span>
            <p className="font-medium text-foreground">{billData.billing.billNumber}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Generated:</span>
            <p className="font-medium text-foreground">{new Date().toLocaleString('en-US')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Customer:</span>
            <p className="font-medium text-foreground">{billData.customer.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total Amount:</span>
            <p className="font-semibold text-primary">${billData.billing.total.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillPreview;