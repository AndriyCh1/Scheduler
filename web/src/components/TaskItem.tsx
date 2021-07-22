import { Box, makeStyles, Typography } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import { green, orange, red } from '@material-ui/core/colors';
import { mutate } from "swr";

const useStyle = makeStyles(theme =>({
    taskItem:{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5px 20px",
        margin: "5px",
        backgroundColor: "#F2F7FF",
        '&:hover': {
            background: "#d8e4e8"
        }
    },
}))


interface TaskDto{
    id: number;
    userId?: number;
    description?: string;
    date?: string;
    time?: string;
    status?: string;
}

interface ITaskItem{
    task: TaskDto;
    mutate: any;
    setUpdateId: (id: number) => void;
}

function TaskItem({task, mutate, setUpdateId}: ITaskItem): JSX.Element { // ?????????

    const classes = useStyle();

    const deleteTask = (id: number): void => {
        if (id >= 0){
            fetch(`http://localhost:3001/api/scheduler/${id}`, {
              method: 'DELETE'
            }).then(() => {
              mutate();
            });
        }
    }


    const completeTask = (id: number): void => {
        let status: string = "completed";

        if (task.status === "completed") status = "inProgress";

        if (id >= 0){
            fetch(`http://localhost:3001/api/scheduler/${id}`, {
              method: 'PUT',
              headers: {'Content-Type': 'application/json; charset=utf-8'},
              body: JSON.stringify({ status: status }),
            }).then(() => {
              mutate();
            });
        } 
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
                    onClick={() => {completeTask(task.id)}}
                />
                <EditIcon 
                    style={{
                        cursor: "pointer", 
                        marginRight:"20px",
                        color: orange[500], 
                        fontSize: 30}}
                    onClick={() => setUpdateId(task.id)}
                />
                <DeleteIcon 
                    style={{
                        cursor: "pointer", 
                        color: red[500], 
                        fontSize: 30
                    }}
                    onClick={() => {deleteTask(task.id)}}
                />
            </Box>
        )
    }

    return(
        <Box className={classes.taskItem}>
            <Box>
                <Typography>{ task.time }</Typography>
                { (task.status === "completed")
                    ? <Typography style={{ textDecoration: "line-through" }}>{task.description}</Typography>
                    : <Typography>{ task.description }</Typography>
                }
            </Box>
            { rudButtons() }
        </Box>
    );
}

export default TaskItem;
