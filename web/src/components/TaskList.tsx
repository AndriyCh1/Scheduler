import { Box, } from "@material-ui/core";
import useSWR from "swr";
import TaskItem from "./TaskItem";
import { TaskDto } from "../dto/task.dto";

interface ITaskList{
    selectedDate: string;
    mutate: any ; // ????????????????????????
    setUpdateId: (id: number | null) => void;
}

function TaskList({selectedDate, mutate, setUpdateId}: ITaskList): JSX.Element {

    const fetcher = (url: string) => fetch(url).then(r => r.json());
    const {data: tasks, error} = useSWR<TaskDto[]>("http://localhost:3001/api/scheduler/", fetcher);
    console.log(typeof(tasks));
    
    const getDataByDate = (date: string): TaskDto[] | undefined => {
        let arr: TaskDto[] | undefined = tasks?.filter( function(task) { return task.date === date });
        return arr;
    }
    
    return(
        <Box>
            {getDataByDate(selectedDate)?.map((task, index) => 
                <TaskItem
                    key={index}
                    task={task}
                    mutate={mutate}
                    setUpdateId={setUpdateId}
                />
            )}
        </Box>
    );
}

export default TaskList;
