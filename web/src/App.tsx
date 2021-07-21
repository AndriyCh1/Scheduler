import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Scheduler from "./components/Scheduler";

function App() {
  return (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Scheduler />
  </MuiPickersUtilsProvider>
  );
}

export default App;
