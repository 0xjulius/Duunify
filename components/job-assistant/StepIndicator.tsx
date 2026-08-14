import { ChevronRight } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Valitse työpaikka" },
    { number: 2, label: "Tarkista asiakirjat" },
    { number: 3, label: "Luo saatekirje" },
  ];

  return (
    <div className="flex items-center gap-3 mb-8">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.number;
        const isPast = currentStep > step.number;

        return (
          <div key={step.number} className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 text-sm font-semibold ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 dark:text-slate-600"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : isPast
                      ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                      : "bg-slate-200 dark:bg-slate-800"
                }`}
              >
                {step.number}
              </div>
              {step.label}
            </div>

            {idx < steps.length - 1 && (
              <ChevronRight
                size={16}
                className="text-slate-300 dark:text-slate-700"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
