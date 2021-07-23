import { Box, makeStyles, TextField } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from "moment";

const useStyle = makeStyles((theme) =>({
    header:{
        backgroundColor: "#50C3FC",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        padding: "10px 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
        height:"60px",

    },
    
    rotated:{
        transform: "rotate(180deg)",
    },

    textField: {
        alignItems: "center",
    },

    dateColor:{
        color: '#000',
        fontSize: '17px',
    }
}));

interface IHeader{  
    setDate: (date: string) => void;
    selectedDate: string;
}

function Header({setDate, selectedDate}: IHeader): JSX.Element{
    const classes = useStyle();

    const incrementDate = (selectedDate: string): void => {
        let date = moment(selectedDate);
        date = date.add(1, 'days');
        setDate(date.format("yyyy-MM-DD"));
    }

    const decrementDate = (selectedDate: string): void => {
        let date = moment(selectedDate);
        date = date.add(-1, 'days');
        setDate(date.format("yyyy-MM-DD"));
    }

    return(
        <Box className={classes.header}>
            <ArrowBackIcon
                 onClick={() => decrementDate(selectedDate)}
            />    
            <TextField
                type="date"
                value={selectedDate}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}

                InputProps={{ 
                    disableUnderline: true,
                    className: classes.dateColor,
                }}

                onChange={e => setDate(e.target.value)}
            />
            <ArrowBackIcon 
                className={classes.rotated}
                onClick={() => incrementDate(selectedDate)}
            />
        </Box>
        );  
    }
export default Header;