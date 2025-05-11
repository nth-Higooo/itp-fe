import { DragOverlay as DndDragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';

import Portal from '@mui/material/Portal';

import ItemBase from '../item/item-base';
import ColumnBase from '../column/column-base';
import { KanbanColumnToolBar } from '../column/kanban-column-toolbar';

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
};

// ----------------------------------------------------------------------
type TKanbanDragOverlayProps = any;

export function KanbanDragOverlay({ columns, tasks, activeId, sx }: TKanbanDragOverlayProps) {
  const columnIds = columns.map((column: any) => column.id);

  const activeColumn = columns.find((column: any) => column.id === activeId);

  const allTasks = Object.values(tasks).flat();

  const activeTask = allTasks.find((task: any) => task.id === activeId);

  return (
    <Portal>
      <DndDragOverlay adjustScale={false} dropAnimation={dropAnimation}>
        {activeId ? (
          <>
            {columnIds.includes(activeId) ? (
              <ColumnOverlay column={activeColumn} tasks={tasks[activeId]} sx={sx} />
            ) : (
              <TaskItemOverlay task={activeTask} sx={sx} />
            )}
          </>
        ) : null}
      </DndDragOverlay>
    </Portal>
  );
}

// ----------------------------------------------------------------------
type TColumnOverlayProps = any;

export function ColumnOverlay({ column, tasks, sx }: TColumnOverlayProps) {
  return (
    <ColumnBase
      slots={{
        header: <KanbanColumnToolBar columnName={column.name} totalTasks={tasks.length} />,
        main: tasks.map((task: any) => <ItemBase key={task.id} task={task} />),
      }}
      stateProps={{ dragOverlay: true }}
      sx={sx}
    />
  );
}

// ----------------------------------------------------------------------
type TTaskItemOverlayProps = any;

export function TaskItemOverlay({ task, sx }: TTaskItemOverlayProps) {
  return <ItemBase task={task} sx={sx} stateProps={{ dragOverlay: true }} />;
}
