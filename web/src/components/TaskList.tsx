import { Box, } from "@material-ui/core";
import useSWR from "swr";
import { MutatorCallback } from "swr/dist/types";
import TaskItem from "./TaskItem";


interface TaskDto{
    id?: number;
    userId?: number;
    description?: string;
    date?: string;
    time?: string;
    status?: string;
}

interface ITaskList{
    date: string;
    mutate: any ;
    // formData: TaskDto;
    // setFormData: React.Dispatch<React.SetStateAction<TaskDto>>;
}
function TaskList({date, mutate}:ITaskList):JSX.Element {
    const fetcher = (url: string) => fetch(url).then(r => r.json());
    const {data: tasks, error} = useSWR<TaskDto[]>("http://localhost:3001/api/scheduler/", fetcher);

    const getDataByDate = (date: string): TaskDto[] | undefined => {
        let arr: TaskDto[] | undefined = tasks?.filter( function(task) { return task.date === date });
        return arr;
    }

    return(
        <Box>
            {getDataByDate(date)?.map((task, index) => 
            <TaskItem
                key={index}
                task={task}
                mutate={mutate}
            />
            )}
        </Box>
    );
}

export default TaskList;
