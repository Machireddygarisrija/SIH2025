import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { RootState, AppDispatch } from '../../redux/store';
import { removeNotification } from '../../redux/slices/notificationSlice';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'from-green-500 to-emerald-600',
  error: 'from-red-500 to-rose-600',
  warning: 'from-yellow-500 to-orange-600',
  info: 'from-blue-500 to-indigo-600',
};

export function Toaster() {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.slice(0, 5).map((notification) => {
          const Icon = iconMap[notification.type];
          const colorClass = colorMap[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              layout
              className={`max-w-md bg-gradient-to-r ${colorClass} text-white rounded-lg shadow-lg overflow-hidden`}
            >
              <div className="p-4 flex items-start space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-sm opacity-90 mt-1">{notification.message}</p>
                </div>
                <button
                  onClick={() => dispatch(removeNotification(notification.id))}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-1 bg-white/30 origin-right"
                onAnimationComplete={() => dispatch(removeNotification(notification.id))}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}