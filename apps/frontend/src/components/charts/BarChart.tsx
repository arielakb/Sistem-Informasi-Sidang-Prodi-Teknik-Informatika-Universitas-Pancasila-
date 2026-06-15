import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  bars: { key: string; name: string; color: string }[];
  title?: string;
}

export default function BarChart({ data, xKey, bars, title }: BarChartProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
          />
          <Legend />
          {bars.map((bar) => (
            <Bar key={bar.key} dataKey={bar.key} name={bar.name} fill={bar.color} radius={[4, 4, 0, 0]} />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}