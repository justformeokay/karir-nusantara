import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Flag, Info, ChevronRight } from 'lucide-react';
import { Announcement, getBanners, getNotifications, getInformation, filterForJobSeekers } from '@/api/announcements';
import { Button } from '@/components/ui/button';

export function AnnouncementBanner() {
  const [banners, setBanners] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getBanners();
        if (response.success) {
          const relevantBanners = filterForJobSeekers(response.data);
          setBanners(relevantBanners);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % banners.length;
        // Skip dismissed banners
        let checkIndex = nextIndex;
        for (let i = 0; i < banners.length; i++) {
          if (!dismissed.has(banners[checkIndex].id)) {
            return checkIndex;
          }
          checkIndex = (checkIndex + 1) % banners.length;
        }
        return nextIndex;
      });
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(timer);
  }, [banners, dismissed]);

  const handleDismiss = (bannerId: number) => {
    setDismissed(prev => new Set(prev).add(bannerId));
  };

  const visibleBanners = banners.filter(b => !dismissed.has(b.id));

  if (isLoading || visibleBanners.length === 0) {
    return null;
  }

  const currentBanner = visibleBanners[currentIndex % visibleBanners.length];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentBanner.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Flag className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {currentBanner.title}
                </h3>
                <p className="text-xs sm:text-sm text-teal-50 line-clamp-1">
                  {currentBanner.content}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {visibleBanners.length > 1 && (
                <div className="hidden sm:flex items-center gap-1 text-xs text-teal-100">
                  {visibleBanners.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        idx === currentIndex % visibleBanners.length
                          ? 'bg-white'
                          : 'bg-teal-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => handleDismiss(currentBanner.id)}
                className="p-1 hover:bg-teal-700 rounded transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        if (response.success) {
          const relevantNotifications = filterForJobSeekers(response.data);
          setNotifications(relevantNotifications.slice(0, 3)); // Show max 3
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading || notifications.length === 0) {
    return null;
  }

  const displayedNotifications = isExpanded ? notifications : notifications.slice(0, 1);

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
      <div className="p-4 space-y-3">
        {displayedNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3"
          >
            <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-blue-900">
                {notification.title}
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                {notification.content}
              </p>
            </div>
          </motion.div>
        ))}
        {notifications.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            {isExpanded ? 'Show Less' : `Show ${notifications.length - 1} More`}
            <ChevronRight
              className={`h-4 w-4 ml-1 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </Button>
        )}
      </div>
    </div>
  );
}

export function InformationSection() {
  const [information, setInformation] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const response = await getInformation();
        if (response.success) {
          const relevantInfo = filterForJobSeekers(response.data);
          setInformation(relevantInfo.slice(0, 2)); // Show max 2
        }
      } catch (error) {
        console.error('Failed to fetch information:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInformation();
  }, []);

  if (isLoading || information.length === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {information.map((info, index) => (
        <motion.div
          key={info.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-green-900 mb-1">
                {info.title}
              </h4>
              <p className="text-sm text-green-700">
                {info.content}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
