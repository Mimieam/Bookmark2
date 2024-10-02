import React from "react";
import { useState } from "react";
import reactLogo from "./assets/folder-closed.svg";
import { Button, Form } from '@douyinfe/semi-ui';

import "./App.css";
import { Toast } from "@douyinfe/semi-ui";
import { BookTree } from "./popup/Tree";


chrome.action.onClicked.addListener(() => {
	organizeBookmarks();
});

globalThis.organizeBookmarks = organizeBookmarks

async function organizeBookmarks() {
	Toast.info("Organizing bookmarks by URL...");
	try {
		const bookmarks = await getAllBookmarks();
		const organizedBookmarks = bookmarks.sort((a, b) => a.url.localeCompare(b.url));

		// Get the parent folders for the bookmarks
		const bookmarkMap = {};
		organizedBookmarks.forEach(
			bookmark => {
				if (!bookmarkMap[bookmark.parentId]) {
					bookmarkMap[bookmark.parentId] = [];
				}
				bookmarkMap[bookmark.parentId].push(bookmark);
			}
		);

		// Move bookmarks to their new positions
		const moves = [];
		for (const parentId in bookmarkMap) {
			const bookmarkGroup = bookmarkMap[parentId];
			for (let i = 0; i < bookmarkGroup.length; i++) {
				moves.push(chrome.bookmarks.move(bookmarkGroup[i].id, { parentId, index: i }));
			}
		}

		// Wait for all moves to complete
		await Promise.all(moves);
		console.log("Bookmarks reorganized by URL in their original folders.");
	} catch (error) {
		console.error("Error reorganizing bookmarks:", error);
	}
}

function getAllBookmarks() {
	return new Promise((resolve, reject) => {
		chrome.bookmarks.getTree((bookmarks) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			const allBookmarks = [];
			const traverseBookmarks = (nodes) => {
				nodes.forEach((node) => {
					if (node.url) {
						allBookmarks.push(node);
					}
					if (node.children) {
						traverseBookmarks(node.children);
					}
				});
			};
			traverseBookmarks(bookmarks);
			resolve(allBookmarks);
		});
	});
}

function App() {
	const [count, setCount] = useState(0);
	
	return (
		<div className="App">
			<h1>Unbound + Me </h1>
			<div style={{ textAlign: 'initial', width: '100vh' }}>
				<BookTree />
			</div>
			<div>
				<a href="#" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<div className="card">
				<button type="button" onClick={() => setCount(count => count + 1)}>
					count is {count}
				</button>
			</div>
		</div>
	);
}

export default App;
