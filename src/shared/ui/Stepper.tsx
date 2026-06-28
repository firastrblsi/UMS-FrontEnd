import React from 'react';
import { LuCheck } from 'react-icons/lu';

export interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full pt-4 pb-12">
      <div className="flex items-center justify-between w-full relative">
        {/* Background Track */}
        <div className="absolute left-[20px] right-[20px] top-[20px] transform -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full" />
        
        {/* Progress Track */}
        <div 
          className="absolute left-[20px] top-[20px] transform -translate-y-1/2 h-1 bg-blue-600 z-0 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - ${currentStep === 0 ? '0px' : '40px'})` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          return (
            <div key={index} className="relative z-10 flex flex-col items-center" style={{ width: '40px' }}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2 
                  ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 
                    isCurrent ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50' : 
                    'bg-white border-gray-300 text-gray-400'}`}
              >
                {isCompleted ? <LuCheck size={20} /> : index + 1}
              </div>
              <div className="absolute top-12 whitespace-nowrap text-xs font-medium text-center transform -translate-x-1/2 left-1/2">
                <span className={`${isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
