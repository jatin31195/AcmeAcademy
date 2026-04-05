import React from "react";

const FormSection = ({ title, icon, children, step }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 md:p-8 shadow-sm">
      
      <div className="flex items-center gap-3 mb-6">
        
        {/* Step Circle */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm">
          {step}
        </div>

        {/* Title + Icon */}
        <div className="flex items-center gap-2 text-foreground">
          {icon}
          <h2 className="text-xl font-heading font-semibold">
            {title}
          </h2>
        </div>

      </div>

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>

    </div>
  );
};

export default FormSection;