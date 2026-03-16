import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

const params = new URLSearchParams(window.location.search);
const redirectedPath = params.get("p");

if (redirectedPath) {
  const decodedPath = decodeURIComponent(redirectedPath);
  window.history.replaceState(null, "", decodedPath);
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
