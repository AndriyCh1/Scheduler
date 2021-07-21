import { Button, makeStyles, TextField } from "@material-ui/core";
import useSWR from 'swr';

import { useState } from "react";
import moment from "moment";
import TaskList from "./TaskList";
import axios from "axios";


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
    date?: string;
    time: string;
    status?: string;
}

interface ITaskForm{
    selectedDate: string;
    mutate: any;
    editedTask?: TaskDto;
    updateId: number | null;
    setUpdateId: (id: number | null) => void;
}

function TaskForm({selectedDate, mutate, updateId, setUpdateId}: ITaskForm): JSX.Element{
    const classes = useStyle();

    const fetcher = (url: string) => fetch(url).then(r => r.json());
    const {data: tasks, error, mutate: mutateDate} = useSWR<TaskDto[]>(`http://localhost:3001/api/scheduler/date/${selectedDate}`, fetcher);


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
    


    const getTaskById = async (id: number) => { // !!!
        if (id > 0){
            const {data} =  await axios.get(`http://localhost:3001/api/scheduler/${id}`);
            setUserInput(data.description);
        } 
    }


    const createTask = (task: TaskDto): void =>  {
        if(checkAvailableTime(task.time)){
            fetch("http://localhost:3001/api/scheduler/", {
                method: 'POST',
                headers:{'Content-Type': 'application/json; charset=utf-8'},
                body: JSON.stringify(task)
            }).then(() => {
                mutate();
                mutateDate();
            });
        }else{
            alert("Time is incorrect");
            
        }
    }

    const updateTask = (id: number): void => {
        if (id >= 0){
            fetch(`http://localhost:3001/api/scheduler/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json; charset=utf-8'},
                body: JSON.stringify({}), 
            }).then(() => {
                mutate("http://localhost:3001/api/scheduler/");
        });} 
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
            value={updateId? userInput :"des"}
            onChange={(e) => setUserInput(e.target.value)}
        />
        <Button 
            className={classes.addTask}
            onClick={() => {
                // createTask({
                //     userId: 2, 
                //     description: userInput, 
                //     date: selectedDate,
                //     time: selectedTimeFrom +"-"+ selectedTimeTo, 
                //     status: "inProcess"
                // } as TaskDto);
                
                setUpdateId(null);
                // setUserInput("");
            }}>
            Add
        </Button>
    </form>
    </>
  );
}

export default TaskForm;
