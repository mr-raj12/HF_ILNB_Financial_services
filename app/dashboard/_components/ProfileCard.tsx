'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface ProfileProps {
  profile: {
    user_name: string;
    user_id: string;
    email: string;
    broker: string;
    exchanges: string[];
    products: string[];
  };
}

export function ProfileCard({ profile }: ProfileProps) {
  if (!profile) {
    return (
      <motion.div 
        className="p-5 rounded-lg shadow bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Profile Data</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load profile information at the moment.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <UserCircleIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.user_name}</h2>
            <p className="text-gray-600 dark:text-gray-400">ID: {profile.user_id}</p>
            <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
          </div>
        </div>
        <div className="md:text-right">
          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded">
            <span className="text-sm text-gray-500 dark:text-gray-400">Broker</span>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.broker}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Exchanges</h3>
          <div className="flex flex-wrap gap-2">
            {profile.exchanges.map((exchange) => (
              <span key={exchange} className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300">
                {exchange}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Products</h3>
          <div className="flex flex-wrap gap-2">
            {profile.products.map((product) => (
              <span key={product} className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300">
                {product}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}