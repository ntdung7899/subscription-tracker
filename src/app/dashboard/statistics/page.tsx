export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Thống kê</h1>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Chi phí theo tháng</h2>
              <div className="text-gray-500">Biểu đồ sẽ được hiển thị ở đây</div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Chi phí theo danh mục</h2>
              <div className="text-gray-500">Biểu đồ sẽ được hiển thị ở đây</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
