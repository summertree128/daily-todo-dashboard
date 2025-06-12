import { useState, useEffect } from 'react';
import { DndProvider, useDrop, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import type { Task } from '../types/Task';
import { Task as TaskComponent } from './Task';
import { NewTaskForm } from './NewTaskForm';

const STORAGE_KEY = 'daily-todo-tasks';
const LAST_RESET_KEY = 'last-reset-time';

// Adjust grid size based on screen size
const getGridSize = () => {
  return { columns: 6, rows: 6 };
};

interface DragItem {
  id: string;
  type: string;
}

const GridCell: React.FC<{
  x: number;
  y: number;
  onDrop: (x: number, y: number, taskId: string) => void;
  tasks: Task[];
}> = ({ x, y, onDrop, tasks }) => {
  const [{ isOver, draggedItem }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: DragItem) => onDrop(x, y, item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem() as DragItem | null,
    }),
  }), [x, y, onDrop, tasks]);

  const draggedTask = draggedItem ? tasks.find(task => task.id === draggedItem.id) : null;
  const isDropTarget = isOver && draggedTask;

  const style = {
    gridColumn: x + 1,
    gridRow: y + 1,
    ...(isDropTarget && draggedTask ? {
      gridColumn: `${x + 1} / span ${draggedTask.size.width}`,
      gridRow: `${y + 1} / span ${draggedTask.size.height}`,
    } : {}),
  };

  return (
    <div
      ref={drop as any}
      className={`grid-cell ${isDropTarget ? 'drop-target' : ''}`}
      style={style}
    />
  );
};

const DeleteDropZone: React.FC<{
  onDrop: (taskId: string) => void;
  isDragging: boolean;
}> = ({ onDrop, isDragging }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: DragItem) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onDrop]);

  return (
    <div
      ref={drop as any}
      className={`delete-drop-zone ${isOver ? 'active' : ''}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100px',
        backgroundColor: isDragging ? (isOver ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.1)') : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease',
        zIndex: 1000,
        pointerEvents: isDragging ? 'auto' : 'none',
      }}
    >
      {isDragging && (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOver ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 0, 0, 0.5)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'all 0.3s ease',
          }}
        >
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      )}
    </div>
  );
};

const TaskGridContent: React.FC<{
  tasks: Task[];
  gridSize: { columns: number; rows: number };
  onTaskToggle: (taskId: string) => void;
  onTaskMove: (x: number, y: number, taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onNewTask: () => void;
  showNewTaskForm: boolean;
}> = ({ tasks, gridSize, onTaskToggle, onTaskMove, onTaskDelete, onNewTask, showNewTaskForm }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Monitor drag state
  const dragLayer = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  useEffect(() => {
    setIsDragging(dragLayer.isDragging);
  }, [dragLayer.isDragging]);

  return (
    <div className="task-grid-container">
      <div 
        className="task-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize.columns}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
          gap: '8px',
          padding: '16px',
          height: 'calc(100vh - 100px)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Render grid cells */}
        {Array.from({ length: gridSize.rows }, (_, y) =>
          Array.from({ length: gridSize.columns }, (_, x) => (
            <GridCell
              key={`${x}-${y}`}
              x={x}
              y={y}
              onDrop={onTaskMove}
              tasks={tasks}
            />
          ))
        )}
        
        {/* Render tasks */}
        {tasks.map(task => (
          <TaskComponent
            key={task.id}
            task={task}
            onToggle={onTaskToggle}
          />
        ))}
      </div>
      
      <DeleteDropZone onDrop={onTaskDelete} isDragging={isDragging} />
      
      <button 
        className="new-task-button"
        onClick={onNewTask}
        aria-label="Add new task"
        style={{
          position: 'fixed',
          bottom: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: showNewTaskForm ? 0 : 1001,
          opacity: showNewTaskForm ? 0 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: showNewTaskForm ? 'none' : 'auto'
        }}
      >
        +
      </button>
    </div>
  );
};

export const TaskGrid: React.FC = () => {
  const [gridSize, setGridSize] = useState(getGridSize());
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [lastResetTime, setLastResetTime] = useState<Date>(() => {
    const savedTime = localStorage.getItem(LAST_RESET_KEY);
    return savedTime ? new Date(savedTime) : new Date();
  });

  // Detect touch device
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0));
  };

  const isMobile = isTouchDevice();

  // Monitor screen size changes
  useEffect(() => {
    const handleResize = () => {
      setGridSize(getGridSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Check for task reset
  useEffect(() => {
    const checkAndResetTasks = () => {
      const now = new Date();
      const lastReset = new Date(lastResetTime);
      
      // If last reset was before yesterday and current time is after 2 AM
      if (
        (now.getDate() > lastReset.getDate() || 
         now.getMonth() > lastReset.getMonth() || 
         now.getFullYear() > lastReset.getFullYear()) && 
        now.getHours() >= 2
      ) {
        // Reset tasks (set completed to false)
        setTasks(prevTasks => 
          prevTasks.map(task => ({
            ...task,
            completed: false
          }))
        );
        setLastResetTime(now);
        localStorage.setItem(LAST_RESET_KEY, now.toISOString());
      }
    };

    // Initial check
    checkAndResetTasks();

    // 1 minute check
    const intervalId = setInterval(checkAndResetTasks, 60000);

    return () => clearInterval(intervalId);
  }, [lastResetTime]);

  const findOptimalPosition = (newTask: Omit<Task, 'id' | 'position'>): { x: number; y: number } => {
    const positions: boolean[][] = Array(gridSize.rows).fill(null).map(() => Array(gridSize.columns).fill(false));

    tasks.forEach(task => {
      for (let y = task.position.y; y < task.position.y + task.size.height; y++) {
        for (let x = task.position.x; x < task.position.x + task.size.width; x++) {
          if (y < gridSize.rows && x < gridSize.columns) {
            positions[y][x] = true;
          }
        }
      }
    });

    for (let y = 0; y < gridSize.rows; y++) {
      for (let x = 0; x < gridSize.columns; x++) {
        let canFit = true;
        for (let dy = 0; dy < newTask.size.height; dy++) {
          for (let dx = 0; dx < newTask.size.width; dx++) {
            if (y + dy >= gridSize.rows || x + dx >= gridSize.columns || positions[y + dy][x + dx]) {
              canFit = false;
              break;
            }
          }
          if (!canFit) break;
        }
        if (canFit) {
          return { x, y };
        }
      }
    }

    return { x: 0, y: 0 };
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const handleTaskMove = (x: number, y: number, taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, position: { x, y } }
        : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleNewTask = (newTask: Omit<Task, 'id'>) => {
    const position = findOptimalPosition(newTask);
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      position,
    };
    setTasks([...tasks, task]);
    setShowNewTaskForm(false);
  };

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={isMobile ? { enableMouseEvents: true } : undefined}>
      <TaskGridContent
        tasks={tasks}
        gridSize={gridSize}
        onTaskToggle={handleTaskToggle}
        onTaskMove={handleTaskMove}
        onTaskDelete={handleTaskDelete}
        onNewTask={() => setShowNewTaskForm(true)}
        showNewTaskForm={showNewTaskForm}
      />

      {showNewTaskForm && (
        <NewTaskForm
          onSubmit={handleNewTask}
          onClose={() => setShowNewTaskForm(false)}
        />
      )}
    </DndProvider>
  );
}; 