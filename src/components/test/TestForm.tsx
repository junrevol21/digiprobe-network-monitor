import { useState } from 'react';
import { TestFormData } from '@/types/network';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, MapPin, FileText, Briefcase, Building2 } from 'lucide-react';

interface TestFormProps {
  defaultOperator: string;
  onSubmit: (data: TestFormData) => void;
  disabled?: boolean;
}

const commonOperators = [
  'Telkomsel',
  'Indosat Ooredoo',
  'XL Axiata',
  'Smartfren',
  'Tri (3)',
  'Biznet',
  'IndiHome',
  'Starlink',
  'FirstMedia',
];

const commonActivities = [
  'Routine Monitoring',
  'Complaint Investigation',
  'Coverage Survey',
  'Event Coverage',
  'Special Assignment',
];

export function TestForm({ defaultOperator, onSubmit, disabled }: TestFormProps) {
  const [formData, setFormData] = useState<TestFormData>({
    operatorLabel: defaultOperator,
    testMode: 'static',
    activity: '',
    remark: '',
    poiName: '',
  });

  const [showOperatorSuggestions, setShowOperatorSuggestions] = useState(false);
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for static test
    if (formData.testMode === 'static' && !formData.poiName.trim()) {
      return;
    }
    
    onSubmit(formData);
  };

  const filteredOperators = commonOperators.filter(op =>
    op.toLowerCase().includes(formData.operatorLabel.toLowerCase())
  );

  const filteredActivities = commonActivities.filter(act =>
    act.toLowerCase().includes(formData.activity.toLowerCase())
  );

  return (
    <Card className="card-glass animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="w-4 h-4 text-primary" />
          Test Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Operator Input with Autocomplete */}
          <div className="space-y-2">
            <Label htmlFor="operator" className="flex items-center gap-1.5 text-xs">
              <Building2 className="w-3 h-3" />
              Operator/Provider
            </Label>
            <div className="relative">
              <Input
                id="operator"
                value={formData.operatorLabel}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, operatorLabel: e.target.value }));
                  setShowOperatorSuggestions(true);
                }}
                onFocus={() => setShowOperatorSuggestions(true)}
                onBlur={() => setTimeout(() => setShowOperatorSuggestions(false), 200)}
                placeholder="e.g., Telkomsel"
                disabled={disabled}
                className="h-10"
              />
              {showOperatorSuggestions && filteredOperators.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-40 overflow-auto">
                  {filteredOperators.map((op) => (
                    <button
                      key={op}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, operatorLabel: op }));
                        setShowOperatorSuggestions(false);
                      }}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <Label htmlFor="testMode" className="flex items-center gap-1.5 text-xs cursor-pointer">
              <MapPin className="w-3 h-3" />
              Test Mode
            </Label>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${formData.testMode === 'static' ? 'font-medium' : 'text-muted-foreground'}`}>
                Static
              </span>
              <Switch
                id="testMode"
                checked={formData.testMode === 'drive'}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, testMode: checked ? 'drive' : 'static' }))
                }
                disabled={disabled}
              />
              <span className={`text-xs ${formData.testMode === 'drive' ? 'font-medium' : 'text-muted-foreground'}`}>
                Drive
              </span>
            </div>
          </div>

          {/* Activity Input with Autocomplete */}
          <div className="space-y-2">
            <Label htmlFor="activity" className="flex items-center gap-1.5 text-xs">
              <Briefcase className="w-3 h-3" />
              Activity
            </Label>
            <div className="relative">
              <Input
                id="activity"
                value={formData.activity}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, activity: e.target.value }));
                  setShowActivitySuggestions(true);
                }}
                onFocus={() => setShowActivitySuggestions(true)}
                onBlur={() => setTimeout(() => setShowActivitySuggestions(false), 200)}
                placeholder="Select or type activity"
                disabled={disabled}
                className="h-10"
              />
              {showActivitySuggestions && filteredActivities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-40 overflow-auto">
                  {filteredActivities.map((act) => (
                    <button
                      key={act}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, activity: act }));
                        setShowActivitySuggestions(false);
                      }}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* POI Name (Required for Static Test) */}
          {formData.testMode === 'static' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="poiName" className="flex items-center gap-1.5 text-xs">
                <MapPin className="w-3 h-3" />
                POI Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="poiName"
                value={formData.poiName}
                onChange={(e) => setFormData(prev => ({ ...prev, poiName: e.target.value }))}
                placeholder="e.g., Mall Ambarrukmo"
                disabled={disabled}
                required={formData.testMode === 'static'}
                className="h-10"
              />
            </div>
          )}

          {/* Remark */}
          <div className="space-y-2">
            <Label htmlFor="remark" className="flex items-center gap-1.5 text-xs">
              <FileText className="w-3 h-3" />
              Remark (Optional)
            </Label>
            <Textarea
              id="remark"
              value={formData.remark}
              onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
              placeholder="Additional notes..."
              disabled={disabled}
              className="min-h-[60px] resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-gradient h-11"
            disabled={disabled || (formData.testMode === 'static' && !formData.poiName.trim())}
          >
            Configure & Start Test
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
