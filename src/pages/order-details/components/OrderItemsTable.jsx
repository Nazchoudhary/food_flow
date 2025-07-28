import React from 'react';

const OrderItemsTable = ({ items }) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Order Items</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Item</th>
              <th className="text-center px-6 py-3 text-sm font-medium text-muted-foreground">Quantity</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Unit Price</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-foreground">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-foreground">
                  ${(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderItemsTable;