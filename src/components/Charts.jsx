import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from "../context/ThemeContext";

export default function Charts({ data }) {
  const { isDarkMode } = useTheme();
  const categoryData = {};

  data.forEach(t => {
    categoryData[t.category] =
      (categoryData[t.category] || 0) + t.amount;
  });

  const chartData = Object.keys(categoryData).map(key => ({
    name: key,
    value: categoryData[key]
  }));

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#6366F1", "#EF4444"];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
            stroke={isDarkMode ? "#111827" : "#fff"}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              color: isDarkMode ? '#F3F4F6' : '#111827'
            }}
            itemStyle={{ color: isDarkMode ? '#F3F4F6' : '#111827' }}
            formatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Legend 
            iconType="circle" 
            wrapperStyle={{ paddingTop: '20px' }} 
            formatter={(value) => <span style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}