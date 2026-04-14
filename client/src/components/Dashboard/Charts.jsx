import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Attendance Trend Chart
export const AttendanceTrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="attendance"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Attendance %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Performance Distribution Chart
export const PerformanceChart = ({ data }) => {
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Course Performance Bar Chart
export const CoursePerformanceChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="percentage" fill="#3b82f6" name="Average %" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Grade Distribution Chart
export const GradeDistributionChart = ({ data }) => {
  const COLORS = {
    'A+': '#10b981',
    'A': '#34d399',
    'B': '#fbbf24',
    'C': '#f59e0b',
    'D': '#f97316',
    'F': '#ef4444',
  };
  
  const chartData = Object.entries(data).map(([grade, count]) => ({
    name: grade,
    value: count,
    color: COLORS[grade] || '#6b7280',
  }));
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Monthly Progress Chart
export const MonthlyProgressChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="attendance"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Attendance"
        />
        <Line
          type="monotone"
          dataKey="performance"
          stroke="#10b981"
          strokeWidth={2}
          name="Performance"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};