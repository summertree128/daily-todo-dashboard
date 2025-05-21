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

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault(); // デフォルトのタッチ動作を防止
    onToggle(task.id);
  };

  return (
    <div
      ref={drag as any}
      className={`task-button ${task.completed ? 'completed' : ''}`}
      style={gridStyle}
      onTouchEnd={handleTouch}
      onClick={() => onToggle(task.id)}
    >
      {task.completed && (
        <span className="material-icons check-icon">check_circle</span>
      )}
      <span className="task-title">{task.title}</span>
    </div>
  );
}; 