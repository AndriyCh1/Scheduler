import Header from "./Header";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { makeStyles, Paper } from "@material-ui/core";
import { useState } from "react";
import moment from "moment";
import useSWR from "swr";


const useStyle = makeStyles(()=>({
    scheduler:{
        margin: "10px auto",
        maxWidth: "600px",
        border: "2px solid #D4F5FE",
        borderRadius: "10px",
    },
}));

interface TaskDto{ //??????????????
    id?: number;
    userId?: number;
    description: string;
    date?: string;
    time: string;
    status?: string;
}

function Scheduler(): JSX.Element {
    const classes = useStyle();

    const [selectedDate, setDate] = useState<string>(moment().format("yyyy-MM-DD"));

    const fetcher = (url: string) => fetch(url).then(r => r.json());
    const {data: tasks, error, mutate} = useSWR<TaskDto[]>("http://localhost:3001/api/scheduler/", fetcher);

    // const [editedTask, setEditedTask] = useState<string>("");

    const [updateId, setUpdateId] = useState<number | null>(null);
    console.log(updateId);
    
    return (
        <Paper className={classes.scheduler}>
            <Header 
                setDate={setDate}
                selectedDate={selectedDate} // ? selected ?
            />
            <TaskList 
                date={selectedDate} 
                mutate={mutate}
                setUpdateId={setUpdateId}

            />
            <TaskForm 
                selectedDate={selectedDate}
                mutate={mutate}
                updateId={updateId}
                setUpdateId={setUpdateId}

            />
        </Paper>
    );
  }
  
export default Scheduler;
  