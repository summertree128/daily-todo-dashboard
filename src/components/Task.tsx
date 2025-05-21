import { useDrag } from 'react-dnd';
import type { Task as TaskType } from '../types/Task';

interface TaskProps {
  task: TaskType;
  onToggle: (id: string) => void;
}

export const Task: React.FC<TaskProps> = ({ task, onToggle }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, type: 'TASK' },
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
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startTime = Date.now();

    const handleTouchEnd = (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = Math.abs(endX - startX);
      const deltaY = Math.abs(endY - startY);
      const deltaTime = endTime - startTime;

      if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
        onToggle(task.id);
      }
    };

    const element = e.currentTarget;
    element.addEventListener('touchend', handleTouchEnd as any, { once: true });
  };

  return (
    <div
      ref={drag as any}
      className={`task-button ${task.completed ? 'completed' : ''}`}
      style={gridStyle}
      onTouchStart={handleTouchStart}
      onClick={() => onToggle(task.id)}
    >
      {task.completed && (
        <span className="material-icons check-icon">check_circle</span>
      )}
      <span className="task-title">{task.title}</span>
    </div>
  );
}; 