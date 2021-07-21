import { Box, makeStyles, Typography } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import { green, orange, red } from '@material-ui/core/colors';
import { mutate } from "swr";
import { useState } from "react";

const useStyle = makeStyles(theme =>({
    taskItem:{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5px 20px",
        margin: "5px",
        backgroundColor: "#F2F7FF",
        '&:hover': {
            background: "#5DDAFC"//"red", //"#5DDAFC",
        }
    },
    avatar: {
        width: theme.spacing(5), // !!!!!!!!!!!!!!!!!!!
        height: theme.spacing(5),
    },
}))


interface TaskDto{
    id?: number;
    userId?: number;
    description?: string;
    date?: string;
    time?: string;
    status?: string;
    setUpdateId: (id: number | null) => void;
}

// {time, description}: 
function TaskItem(props: any): JSX.Element { // ?????????????????????????

    const classes = useStyle();
    const getTask = (id: number) => {
        if (id >= 0){
            fetch(`http://localhost:3001/api/scheduler/${id}`, {
              method: 'GET'
            }).then((res) => {
            //   mutate("http://localhost:3001/api/scheduler/");
            console.log(res);
            
        });}
    }
  
    const deleteTask = (id: number): void => {
        if (id >= 0){
            fetch(`http://localhost:3001/api/scheduler/${id}`, {
              method: 'DELETE'
            }).then(() => {
              mutate("http://localhost:3001/api/scheduler/");
        });}
    }

    // const updateTask = (id: number, time: string, description: string): void => {
    //     if (id >= 0){
    //         fetch(`http://localhost:3001/api/scheduler/${id}`, {
    //           method: 'PUT',
    //           headers: {'Content-Type': 'application/json; charset=utf-8'},
    //           body: JSON.stringify({description: description, time: time}), 
    //         }).then(() => {
    //           mutate("http://localhost:3001/api/scheduler/");
    //     });} 
    // }

    const completeTask = (id: number): void => {
        let status: string = "completed";

        if (props.task.status === "completed"){
            status = "inProgress";
        }

        if (id >= 0){
            fetch(`http://localhost:3001/api/scheduler/${id}`, {
              method: 'PUT',
              headers: {'Content-Type': 'application/json; charset=utf-8'},
              body: JSON.stringify({ ...props.task, status: status }), // ???? props.task.status==data.status,
            }).then(() => {
              mutate("http://localhost:3001/api/scheduler/");
        });} 
    }

    const rudButtons = (): JSX.Element => {
        return (
            <Box>
                <DoneIcon
                    style={{
                        cursor: "pointer", 
                        marginRight:"20px",
                        color: green[500], 
                        fontSize: 30}}
                    onClick={() => {completeTask(props.task.id)}}
                />
                <EditIcon 
                    style={{
                        cursor: "pointer", 
                        marginRight:"20px",
                        color: orange[500], 
                        fontSize: 30}}
                    onClick={() => props.setUpdateId(props.task.id)}
                />
                <DeleteIcon 
                    style={{
                        cursor: "pointer", 
                        color: red[500], 
                        fontSize: 30
                    }}
                    onClick={() => {deleteTask(props.task.id)}}
                />
            </Box>
        )
    }
    return(
        <Box className={classes.taskItem}>
            <Box>
                <Typography>{ props.task.time }</Typography>
                { (props.task.status === "completed")
                    ? <Typography style={{ textDecoration:"line-through" }}>{props.task.description}</Typography>
                    : <Typography>{ props.task.description }</Typography>
                }
            </Box>
            {rudButtons()}
        </Box>
    );
}

export default TaskItem;
