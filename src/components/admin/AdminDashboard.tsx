import React from 'react';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';

const AdminDashboard: React.FC = () => {
  const { user, logoutAdmin } = useAdminAuthStore();

  const handleLogout = async () => {
    await logoutAdmin();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-gray-700 p-6">
              <h2 className="mb-4 text-xl font-semibold">Welcome to the Admin Dashboard</h2>
              <p className="mb-4">
                This is a protected area for administrators only. Here you can manage your application.
              </p>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Dashboard Cards */}
                <div className="rounded-md bg-gray-800 p-4 shadow">
                  <h3 className="mb-2 text-lg font-medium">Products</h3>
                  <p className="text-gray-300">Manage your food products</p>
                  <div className="mt-4">
                    <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                      View Products
                    </button>
                  </div>
                </div>
                
                <div className="rounded-md bg-gray-800 p-4 shadow">
                  <h3 className="mb-2 text-lg font-medium">Categories</h3>
                  <p className="text-gray-300">Manage food categories</p>
                  <div className="mt-4">
                    <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                      View Categories
                    </button>
                  </div>
                </div>
                
                <div className="rounded-md bg-gray-800 p-4 shadow">
                  <h3 className="mb-2 text-lg font-medium">Users</h3>
                  <p className="text-gray-300">Manage administrator users</p>
                  <div className="mt-4">
                    <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                      View Users
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 