import { useDrag } from 'react-dnd';
import type { Task as TaskType } from '../types/Task';

interface TaskProps {
  task: TaskType;
  onToggle: (id: string) => void;
}

export const Task: React.FC<TaskProps> = ({ task, onToggle }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: () => ({ id: task.id, type: 'TASK' }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id]);

  const gridStyle = {
    gridColumn: `${task.position.x + 1} / span ${task.size.width}`,
    gridRow: `${task.position.y + 1} / span ${task.size.height}`,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    e.currentTarget.setAttribute('data-touch-start-x', touch.clientX.toString());
    e.currentTarget.setAttribute('data-touch-start-y', touch.clientY.toString());
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) {
      const touch = e.changedTouches[0];
      const startX = Number(e.currentTarget.getAttribute('data-touch-start-x'));
      const startY = Number(e.currentTarget.getAttribute('data-touch-start-y'));
      
      if (startX && startY) {
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);
        
        if (deltaX < 20 && deltaY < 20) {
          onToggle(task.id);
        }
      } else {
        onToggle(task.id);
      }
    }
  };

  return (
    <div
      ref={drag as any}
      className={`task-button ${task.completed ? 'completed' : ''}`}
      style={gridStyle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {task.completed && (
        <span className="material-icons check-icon">check_circle</span>
      )}
      <span className="task-title">{task.title}</span>
    </div>
  );
}; 