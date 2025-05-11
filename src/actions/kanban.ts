import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const KANBAN_ENDPOINT = endpoints.kanban;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR(KANBAN_ENDPOINT, fetcher, swrOptions);

  const memoizedValue = useMemo(() => {
    const tasks = data?.board.tasks ?? {};
    const columns = data?.board.columns ?? [];

    return {
      board: { tasks, columns },
      boardLoading: isLoading,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !isLoading && !columns.length,
    };
  }, [data?.board.columns, data?.board.tasks, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createColumn(columnData: any) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      // add new column in board.columns
      const columns = [...board.columns, columnData];

      // add new task in board.tasks
      const tasks = { ...board.tasks, [columnData.id]: [] };

      return { ...currentData, board: { ...board, columns, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateColumn(columnId: any, columnName: any) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, columnName };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      const columns = board.columns.map((column: any) =>
        column.id === columnId
          ? {
              // Update data when found
              ...column,
              name: columnName,
            }
          : column
      );

      return { ...currentData, board: { ...board, columns } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveColumn(updateColumns: any) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      return { ...currentData, board: { ...board, columns: updateColumns } };
    },
    false
  );

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateColumns };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-column' } });
  }
}

// ----------------------------------------------------------------------

export async function clearColumn(columnId: any) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'clear-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      // remove all tasks in column
      const tasks = { ...board.tasks, [columnId]: [] };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId: any) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      // delete column in board.columns
      const columns = board.columns.filter((column: any) => column.id !== columnId);

      // delete tasks by column deleted
      const tasks = Object.keys(board.tasks)
        .filter((key: any) => key !== columnId)
        .reduce((obj: any, key: any) => {
          obj[key] = board.tasks[key];
          return obj;
        }, {});

      return { ...currentData, board: { ...board, columns, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createTask(columnId: any, taskData: any) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      // add task in board.tasks
      const tasks = { ...board.tasks, [columnId]: [taskData, ...board.tasks[columnId]] };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateTask(columnId: any, taskData: any) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      // tasks in column
      const tasksInColumn = board.tasks[columnId];

      // find and update task
      const updateTasks = tasksInColumn.map((task: any) =>
        task.id === taskData.id
          ? {
              // Update data when found
              ...task,
              ...taskData,
            }
          : task
      );

      const tasks = { ...board.tasks, [columnId]: updateTasks };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveTask(updateTasks: any) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      // update board.tasks
      const tasks = updateTasks;

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateTasks };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-task' } });
  }
}

// ----------------------------------------------------------------------

export async function deleteTask(columnId: any, taskId: any) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: any) => {
      const { board } = currentData;

      // delete task in column
      const tasks = {
        ...board.tasks,
        [columnId]: board.tasks[columnId].filter((task: any) => task.id !== taskId),
      };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}
