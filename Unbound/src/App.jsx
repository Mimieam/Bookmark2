import React from "react";
import { useState } from "react";
import reactLogo from "./assets/folder-closed.svg";
import { Button, Form } from '@douyinfe/semi-ui';

import "./App.css";
import { Toast } from "@douyinfe/semi-ui";
import { BookTree } from "./popup/Tree";

function App() {
	const [count, setCount] = useState(0);
	
	return (
		<div className="App">
			<h1>Unbound + Me </h1>
			<div>
				<a href="#" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<div className="card">
				<div style={{ textAlign: 'initial', width: '100vh' }}>
					<BookTree />
				</div>
				<button type="button" onClick={() => setCount(count => count + 1)}>
					count is {count}
				</button>
			</div>


		</div>
	);
}

export default App;
