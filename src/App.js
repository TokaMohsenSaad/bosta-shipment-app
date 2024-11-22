import "./App.css";
import Header from "./components/Header";
import Timeline from "./components/Timeline/Timeline";
import "bootstrap/dist/css/bootstrap.min.css";
import { TrackingProvider } from "./Context/TrackingContext";

function App() {
  return (
    <div>
      <TrackingProvider>
        <Header></Header>
        <Timeline className="mt-5"></Timeline>
      </TrackingProvider>
    </div>
  );
}

export default App;
