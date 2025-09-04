
import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="max-w-3xl mx-auto mb-2 p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm">
      <p>
        <span className="font-semibold">Error:</span> {error}
      </p>
    </div>
  );
};

export default ErrorDisplay;
