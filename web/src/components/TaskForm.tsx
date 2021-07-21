import { Button, makeStyles, TextField } from "@material-ui/core";
import useSWR from 'swr';

import { useState } from "react";
import moment from "moment";
import TaskList from "./TaskList";


const useStyle = makeStyles(theme => ({
    taskForm:{
        display: "flex",
        alignItems: "center",
        margin: "25px 15px"
    },
    addTask:{
        width: "15%",
        height:"100%",
        backgroundColor:"#6ECAFF",
        border: "none",
        cursor: "pointer"
    },
    textField: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(5),
        paddin: theme.spacing(1),
        marginRight: theme.spacing(2),
        width:"80%",
        height:"10px",
    },
    timeField:{
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(5),
        paddin: theme.spacing(1),
        marginRight: theme.spacing(2),
        width:"20%",
        height:"10px",
    },
}))

interface TaskDto{
    id?: number;
    userId?: number;
    description: string;
    date: string;
    time: string;
    status: string;
}

interface ITaskForm{
    selectedDate: string;
    mutate: any;
}

function TaskForm({selectedDate, mutate}: ITaskForm): JSX.Element{
    const classes = useStyle();

    const fetcher = (url: string) => fetch(url).then(r => r.json());
    const {data: tasks, error} = useSWR<TaskDto[]>(`http://localhost:3001/api/scheduler/date/${selectedDate}`, fetcher);

    const [userInput, setUserInput] = useState<string>("");
    const [selectedTimeFrom, setTimeFrom] = useState<string>(moment().format("HH:mm")); 
    const [selectedTimeTo, setTimeTo] = useState<string>(moment().format("HH:mm")); 
    
    const checkAvailableTime = (times: string): boolean => {

        let isCorrect: boolean = true;
        const timeFrom: moment.Moment= moment(times.split("-")[0], "HH:mm");
        const timeTo: moment.Moment = moment(times.split("-")[1], "HH:mm");

        if(timeFrom.isBefore(timeTo)){
            tasks?.forEach((task) => {

                const storedTimeFrom: moment.Moment = moment(task.time?.split("-")[0], "HH:mm");
                const storedTimeTo: moment.Moment = moment(task.time?.split("-")[1], "HH:mm");

                if((timeFrom.isBefore(storedTimeTo) && storedTimeFrom.isBefore(timeFrom)) 
                    || (timeTo.isBefore(storedTimeTo) && storedTimeFrom.isBefore(timeTo)) ){
                    
                    isCorrect = false;
                    return;
                }
            })
            return isCorrect;
        }
        return false;
    }
    
    const createTask = (task: TaskDto): void =>  {
        console.log(task.time,"task");
        if(checkAvailableTime(task.time)){
            fetch("http://localhost:3001/api/scheduler/", {
                method: 'POST',
                headers:{'Content-Type': 'application/json; charset=utf-8'},
                body: JSON.stringify(task)
            }).then(() => {
                mutate();
            });
        }else{
            console.log("date error");
            
        }
    }
    return(
    <>
    <form className={classes.taskForm}>  
        <TextField className={classes.timeField} 
            size="small"
            label="Від"
            type="time"
            value={selectedTimeFrom}
            onChange={(e) => setTimeFrom(e.target.value)}
        />
        <TextField className={classes.timeField} 
            size="small"
            label="До"
            type="time"
            value={selectedTimeTo}
            onChange={(e) => setTimeTo(e.target.value)}
        />
        <TextField 
            className={classes.textField} 
            variant="filled"
            size="small"
            onChange={(e) => setUserInput(e.target.value)}
        />
        <Button 
            className={classes.addTask}
            onClick={() => {
                createTask({
                    userId: 2, 
                    description: userInput, 
                    date: selectedDate,
                    time: selectedTimeFrom +"-"+ selectedTimeTo, 
                    status: "inProcess"
                } as TaskDto);
                // setUserInput("");
            }}>
            Add
        </Button>
    </form>
    {/* <Typography align="center"> temp: { (selectedDate.split("T"))[0] + " " + (selectedDate.split("T"))[1]}</Typography> */}
    </>
  );
}

export default TaskForm;
