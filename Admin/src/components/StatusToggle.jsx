import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const StatusToggle = ({
  label = 'Active',
  checked,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="data-[state=checked]:bg-success"
      />
      <Label className="text-foreground cursor-pointer">
        {label}
        <span
          className={cn(
            'ml-2 text-sm',
            checked ? 'text-success' : 'text-muted-foreground'
          )}
        >
          ({checked ? 'Active' : 'Inactive'})
        </span>
      </Label>
    </div>
  );
};

export default StatusToggle;
