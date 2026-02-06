import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Estimates Only</p>
          <p>
            These calculations are estimates based on standard rates and may not
            reflect your actual import costs. Actual duties depend on NRA
            classification, product valuation, and current regulations. Always
            consult the National Revenue Authority (NRA) for official
            assessments.
          </p>
        </div>
      </div>
    </div>
  );
}
