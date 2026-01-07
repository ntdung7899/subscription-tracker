export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cài đặt</h1>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Thông báo</h2>
                <p className="text-gray-600">Cấu hình email thông báo và nhắc nhở</p>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-2">Google Drive</h2>
                <p className="text-gray-600">Kết nối với Google Drive để backup dữ liệu</p>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-2">Tài khoản</h2>
                <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
