const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-primary-100 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;