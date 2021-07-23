import {Box} from '@material-ui/core';
import useSWR from 'swr';
import TaskItem from './TaskItem';
import {TaskDto} from '../dto/task.dto';

interface TaskListProps{
    selectedDate: string;
    mutate: () => void; 
    setUpdateId: (id: number | null) => void;
}

// eslint-disable-next-line max-len
function TaskList({selectedDate, mutate, setUpdateId}: TaskListProps):JSX.Element {
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const {data: tasks, error} = useSWR<TaskDto[]>('http://localhost:3001/api/scheduler/', fetcher);

  const getTasksByDate = (date: string): TaskDto[] | undefined => {
    const filteredTasks: TaskDto[] | undefined = tasks?.filter(
      task => task.date === date
    );

    return filteredTasks;
  };

  return (
    <Box>
      {getTasksByDate(selectedDate)?.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          mutate={mutate}
          setUpdateId={setUpdateId}
        />
      ))}
    </Box>
  );
}

export default TaskList;
