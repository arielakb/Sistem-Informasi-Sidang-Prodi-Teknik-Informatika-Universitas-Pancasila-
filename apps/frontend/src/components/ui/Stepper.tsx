import { Check } from 'lucide-react';

export interface StepperStep {
  label: string;
  description?: string;
  completed?: boolean;
  error?: boolean;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  vertical?: boolean;
  showNumbers?: boolean;
}

export default function Stepper({
  steps,
  currentStep,
  onStepClick,
  vertical = false,
  showNumbers = true,
}: StepperProps) {
  return (
    <div className={vertical ? 'space-y-4' : 'flex items-center justify-between'}>
      {steps.map((step, index) => {
        const isCompleted = step.completed || index < currentStep;
        const isCurrent = index === currentStep;
        const isActive = index <= currentStep;

        return (
          <div
            key={index}
            className={`flex-1 ${vertical ? '' : 'flex items-center'}`}
          >
            {/* Step Item */}
            <div
              className={`flex items-center ${
                vertical ? 'mb-6' : 'gap-3'
              } cursor-pointer`}
              onClick={() => onStepClick?.(index)}
            >
              {/* Circle */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                    : 'bg-gray-200 text-gray-500'
                } ${step.error ? 'bg-red-500 text-white' : ''}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : showNumbers ? (
                  index + 1
                ) : (
                  ''
                )}
              </div>

              {/* Label & Description */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-sm ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`${
                  vertical
                    ? 'h-6 ml-5 w-0.5'
                    : 'flex-1 h-0.5 mx-2 mb-10'
                } ${isCompleted ? 'bg-green-500' : 'bg-gray-200'} transition-all`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
