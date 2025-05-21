import { useEffect, useState } from 'react'
import { TaskGrid } from './components/TaskGrid'
import './index.css'

function App() {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  useEffect(() => {
    // Service Workerの更新をチェック
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        // 更新通知を受け取る
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'UPDATE_AVAILABLE') {
            setShowUpdateNotification(true);
          }
        });

        // 定期的な更新チェック
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // 1時間ごとにチェック
      });
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.update();
          window.location.reload();
        }
      });
    }
  };

  return (
    <>
      <TaskGrid />
      {showUpdateNotification && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span>新しいバージョンが利用可能です</span>
          <button
            onClick={handleUpdate}
            style={{
              backgroundColor: 'white',
              color: 'var(--primary-color)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            更新する
          </button>
        </div>
      )}
    </>
  )
}

export default App
