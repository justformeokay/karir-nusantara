import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TestSessionGuardProps {
  children: React.ReactNode;
  isActive: boolean;
  onAttemptExit?: () => void;
}

/**
 * TestSessionGuard wraps the test page to:
 * - Prevent accidental navigation away
 * - Prevent browser back button
 * - Prevent tab/window closing
 * - Warn on browser close/reload
 */
export const TestSessionGuard: React.FC<TestSessionGuardProps> = ({
  children,
  isActive,
  onAttemptExit,
}) => {
  const navigate = useNavigate();
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [exitReason, setExitReason] = useState<'back' | 'unload' | 'navigation'>('back');
  const navigationBlockedRef = useRef(false);

  // Block browser back button
  useEffect(() => {
    if (!isActive) return;

    // Push a history entry to detect back button
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Try to go forward to prevent back navigation
      window.history.pushState(null, '', window.location.href);
      setExitReason('back');
      setShowExitWarning(true);
      onAttemptExit?.();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isActive, onAttemptExit]);

  // Block window close/reload (beforeunload)
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      navigationBlockedRef.current = true;
      setExitReason('unload');
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isActive]);

  // Block keyboard shortcut Ctrl+W, Cmd+W
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + W (close tab)
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        setExitReason('unload');
        setShowExitWarning(true);
        onAttemptExit?.();
      }
      // Ctrl/Cmd + Q (quit browser)
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        setExitReason('unload');
        setShowExitWarning(true);
        onAttemptExit?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onAttemptExit]);

  // Block visibility change (user switches tab)
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched to another tab - warn them
        console.warn('User switched away from test tab');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  const handleForcedExit = () => {
    setShowExitWarning(false);
    navigate('/tes-wawancara');
  };

  return (
    <>
      {children}

      {/* Exit warning dialog */}
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari Tes?</AlertDialogTitle>
            <AlertDialogDescription>
              {exitReason === 'back'
                ? 'Anda tidak bisa menggunakan tombol kembali saat mengerjakan tes. Apakah Anda ingin menyelesaikan tes?'
                : 'Tes wawancara harus diselesaikan sebelum Anda meninggalkan halaman ini. Semua jawaban yang belum dikirim akan hilang.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={() => setShowExitWarning(false)}>
              Lanjutkan Tes
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleForcedExit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Keluar Paksa (Batalkan Tes)
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
