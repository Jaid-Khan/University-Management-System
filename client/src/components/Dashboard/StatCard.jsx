const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full text-white`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
