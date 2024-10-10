import React, { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import reactLogo from "./assets/folder-closed.svg";
import { Button, Form } from '@douyinfe/semi-ui';
import { pipeline } from '@xenova/transformers';

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
	// const [pipe, setPipe] = useState(null);
	// // useEffect(() => {

	// // 	let pipe = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
	// // 	let out = await pipe('I love transformers!');
	// // 	console.log(out);
	// // }, []);

	// const loadPipeline = useCallback(async () => {
	// 	const _pipe = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
	// 	return _pipe;
	// }, []);

	// const memoizedPipeline = useMemo(() => loadPipeline(), [loadPipeline]);

	// useEffect(() => {
	// 	async function loadData() {
	// 		const _pipe = await memoizedPipeline;
	// 		if (_pipe) {
	// 			globalThis.pipeline = pipeline
	// 			globalThis.pipe = _pipe
	// 			console.log('Setting up pipeline', _pipe);
	// 			// setPipe(_pipe);
	// 			console.log(await _pipe('I love transformers!'));
	// 		}
	// 	}
	// 	loadData();
	// }, [memoizedPipeline]);


	return (
		<div className="App">
			<h1>Unbound + Me </h1>
			<div style={{ textAlign: 'initial'}}>
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
