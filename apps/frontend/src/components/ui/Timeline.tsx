import { Check, Clock, AlertCircle } from 'lucide-react';

export interface TimelineItem {
  id: string;
  label: string;
  description?: string;
  status: 'completed' | 'pending' | 'current' | 'error';
  date?: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  vertical?: boolean;
}

export default function Timeline({ items, vertical = true }: TimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5" />;
      case 'current':
        return <Clock className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'current':
        return 'bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-300';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getConnectorColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-300';
      case 'current':
        return 'bg-blue-300';
      case 'error':
        return 'bg-red-300';
      default:
        return 'bg-gray-200';
    }
  };

  if (!vertical) {
    // Horizontal timeline
    return (
      <div className="flex items-center justify-between gap-2 mb-8">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center flex-1">
            {/* Timeline node */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(
                  item.status
                )}`}
              >
                {item.icon || getStatusIcon(item.status)}
              </div>
              <p className="text-xs font-semibold text-center mt-2 max-w-xs">
                {item.label}
              </p>
            </div>

            {/* Connector */}
            {index < items.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${getConnectorColor(item.status)}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Vertical timeline
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={item.id} className="relative">
          {/* Timeline node and connector */}
          <div className="flex gap-4">
            {/* Left side - timeline indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getStatusColor(
                  item.status
                )}`}
              >
                {item.icon || getStatusIcon(item.status)}
              </div>

              {/* Connector line to next item */}
              {index < items.length - 1 && (
                <div
                  className={`w-1 h-12 mt-2 ${getConnectorColor(
                    items[index + 1].status
                  )}`}
                />
              )}
            </div>

            {/* Right side - content */}
            <div className="pt-1 pb-6">
              <h4 className="font-semibold text-gray-900">{item.label}</h4>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
              {item.date && (
                <p className="text-xs text-gray-500 mt-2">{item.date}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
