import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowRight, faCopy, faTrashAlt, faDumpster } from "@fortawesome/free-solid-svg-icons";

library.add(faArrowLeft, faArrowRight, faCopy, faTrashAlt, faDumpster);


import React from "react";
import ReactDOM from "react-dom";

import Application from "./Application/Index.jsx";

ReactDOM.render((<Application />), document.getElementById("Application"));
