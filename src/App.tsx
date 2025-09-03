import { useEffect, useState } from 'react'
import { TaskGrid } from './components/TaskGrid'
import { SideMenu, MenuButton } from './components/SideMenu'
import './index.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return (
    <div className="App">
      <MenuButton onClick={() => setIsMenuOpen(true)} isOpen={isMenuOpen} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TaskGrid />
    </div>
  )
}

export default App
