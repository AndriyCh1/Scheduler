import { Box, makeStyles, TextField } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from "moment";
import { useState } from "react";

const useStyle = makeStyles((theme) =>({
    header:{
        backgroundColor: "#50C3FC",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        padding: "10px 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    
    rotated:{
        transform: "rotate(180deg)",
    },
    textField: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(5),
        paddin: theme.spacing(1),
        marginRight: theme.spacing(2),
        width:"80%",
        height:"10px",
        alignItems:"center"
    },
}));

interface IsetDate{  
    setDate: React.Dispatch<React.SetStateAction<string>>
    selectedDate: string
}

function Header({setDate, selectedDate}: IsetDate): JSX.Element{
    const classes = useStyle();

    const [isOpen, setIsOpen] = useState(false);


    const IncrementDate = (selectedDate: string): void => {
        let date = moment(selectedDate);
        date = date.add(1, 'days');
        setDate(date.format("yyyy-MM-DD"));
    }

    const DecrementDate = (selectedDate: string): void => {
        let date = moment(selectedDate);
        date = date.add(-1, 'days');
        setDate(date.format("yyyy-MM-DD"));
    }

    return(
        <Box className={classes.header}>
            <ArrowBackIcon
                 onClick={() => DecrementDate(selectedDate)}
            />    
        <TextField
            label="Дата"
            type="date"
            value={selectedDate}
            className={classes.textField}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{ disableUnderline: true }}
            onChange={e => setDate(e.target.value)}
        />
            <ArrowBackIcon 
                className={classes.rotated}
                onClick={() => IncrementDate(selectedDate)}
            />
        </Box>
        );  
    }
export default Header;