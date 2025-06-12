import { useEffect } from 'react'
import { TaskGrid } from './components/TaskGrid'
import './index.css'

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return (
    <div className="App">
      <TaskGrid />
    </div>
  )
}

export default App
