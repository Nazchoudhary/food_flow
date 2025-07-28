import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const BillCustomization = ({ billSettings, onSettingsChange, onApplySettings }) => {
  const handleInputChange = (field, value) => {
    onSettingsChange({
      ...billSettings,
      [field]: value
    });
  };

  const handleReset = () => {
    onSettingsChange({
      taxRate: 8.5,
      discount: 0,
      serviceCharge: 0,
      includeGST: true,
      customNote: ''
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Bill Customization</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {/* Tax Rate */}
        <div>
          <Input
            label="Tax Rate (%)"
            type="number"
            value={billSettings.taxRate}
            onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
            placeholder="8.5"
            min="0"
            max="30"
            step="0.1"
          />
        </div>

        {/* Discount */}
        <div>
          <Input
            label="Discount ($)"
            type="number"
            value={billSettings.discount}
            onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Service Charge */}
        <div>
          <Input
            label="Service Charge ($)"
            type="number"
            value={billSettings.serviceCharge}
            onChange={(e) => handleInputChange('serviceCharge', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Custom Note */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Custom Note
          </label>
          <textarea
            value={billSettings.customNote}
            onChange={(e) => handleInputChange('customNote', e.target.value)}
            placeholder="Add a custom message to the bill..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSettingsChange({
                ...billSettings,
                discount: 10,
                customNote: 'Happy Hour Discount Applied!'
              })}
            >
              Happy Hour
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSettingsChange({
                ...billSettings,
                serviceCharge: 5,
                customNote: 'Service charge for table service'
              })}
            >
              Table Service
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSettingsChange({
                ...billSettings,
                discount: 15,
                customNote: 'Senior Citizen Discount'
              })}
            >
              Senior Discount
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSettingsChange({
                ...billSettings,
                taxRate: 0,
                customNote: 'Tax-free purchase'
              })}
            >
              Tax Free
            </Button>
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            onClick={onApplySettings}
            iconName="Check"
            iconPosition="left"
          >
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillCustomization;