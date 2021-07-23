import {
  Button, makeStyles, TextField, Box,
} from '@material-ui/core';
import useSWR from 'swr';

import {useState, useEffect} from 'react';
import moment from 'moment';
import axios from 'axios';

import {TaskDto} from '../dto/task.dto';

const useStyle = makeStyles((theme) => ({
  taskForm: {
    display: 'flex',
    alignItems: 'center',
    margin: '25px 15px',
  },
  addTask: {
    alignSelf: 'center',
    backgroundColor: '#6ECAFF',
    border: 'none',
    cursor: 'pointer',
  },
  saveEdited: {
    backgroundColor: '#6ECAFF',
    marginBottom: theme.spacing(1),
  },
  cancelEdited: {
    backgroundColor: '#6ECAFF',
  },
  textField: {
    width: '80%',
    height: '10px',
    paddin: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(5),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  timeField: {
    width: '20%',
    height: '10px',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(5),
    paddin: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

interface TaskFormProps{
    selectedDate: string;
    mutate: () => void;
    editedTask?: TaskDto;
    updateId: number | null;
    setUpdateId: (id: number | null) => void;
}

function TaskForm({
  selectedDate, mutate, updateId, setUpdateId,
}: TaskFormProps): JSX.Element {
    
  const classes = useStyle();
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const {data: tasks, mutate: mutateDate} = useSWR<TaskDto[]>(
    `http://localhost:3001/api/scheduler/date/${selectedDate}`, 
    fetcher
  );
  const [userInput, setUserInput] = useState('');
  const [selectedTimeFrom, setTimeFrom] = useState(
    moment()
      .format('HH:mm')
  );
  const [selectedTimeTo, setTimeTo] = useState(
    moment()
      .add(1, 'hours')
      .format('HH:mm')
  );

  useEffect(() => {
    updateId ? getTaskById(updateId) : getTaskById(-1);
  }, [updateId]);

  const checkAvailableTime = (times: string): boolean => {
    let isCorrect = true;
    const timeFrom = moment(times.split('-')[0], 'HH:mm');
    const timeTo = moment(times.split('-')[1], 'HH:mm');

    if (timeFrom.isBefore(timeTo)) {
      tasks?.forEach((task) => {

        const storedTimeFrom = moment(task.time?.split('-')[0],'HH:mm');
        const storedTimeTo = moment(task.time?.split('-')[1],'HH:mm');
        // eslint-disable-next-line max-len
        const isCorrectFrom = timeFrom.isBefore(storedTimeFrom) && timeTo.isBefore(storedTimeFrom);
        // eslint-disable-next-line max-len
        const isCorrectTo = storedTimeTo.isBefore(timeFrom) && storedTimeTo.isBefore(timeTo);

        if (!isCorrectFrom && !isCorrectTo) {
          isCorrect = false;
        }
      });

      return isCorrect;
    }
    
    return false;
  };

  const getTaskById = async (id: number) => {
    if (id > 0) {
      const {data} = await axios.get(`http://localhost:3001/api/scheduler/${id}`);
      setUserInput(data.description);
    }
  };

  const createTask = (task: TaskDto): void => {
    if (checkAvailableTime(task.time)) {
      fetch('http://localhost:3001/api/scheduler/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify(task),
      }).then(() => {
        mutate();
        mutateDate();
      });
    } else {
      alert(`Неправильний проміжок часу. Перевірте його коректність 
            чи впевніться, що він не зайнятий.`);
    }
  };

  const updateTask = (id: number, input: string): void => {
    if (id > 0) {
      fetch(`http://localhost:3001/api/scheduler/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify({description: input}),
      })
        .then(() => mutate())
        .catch(error => alert(`Виникла помилка ${error}`));
    }
  };

  return (
    <>
      <form className={classes.taskForm}>
        <TextField
          className={classes.timeField}
          size="small"
          label="Від"
          type="time"
          value={selectedTimeFrom}
          onChange={(e) => setTimeFrom(e.target.value)}
        />
        <TextField
          className={classes.timeField}
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
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        {!updateId
          ? (
            <Button
              className={classes.addTask}
              onClick={() => {
                createTask({
                  userId: 2,
                  description: userInput,
                  date: selectedDate,
                  time: `${selectedTimeFrom}-${selectedTimeTo}`,
                  status: 'inprocess',
                } as TaskDto);
                setUserInput('');
              }}
            >
              Додати
            </Button>
          )
          : (
            <Box>
              <Button
                className={classes.saveEdited}
                onClick={() => {
                  updateTask(updateId, userInput);
                  setUpdateId(null);
                  setUserInput('');
                }}
              >
                Зберегти
              </Button>
              <Button
                className={classes.cancelEdited}
                onClick={() => {
                  setUpdateId(null);
                  setUserInput('');
                }}
              >
                Скасувати
              </Button>
            </Box>
          )}
      </form>
    </>
  );
}

export default TaskForm;
