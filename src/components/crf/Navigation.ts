import React from 'react'
// import { getQuestionMenuType, GroupMap, Question, QuestionMenuTypesMap, SurveyItem, SurveyMap } from '../../core/schema';
import { getQuestionMenuType, GroupMap, QuestionMenuTypesMap, SurveyMap } from '../../core/schema';
import { Survey, Item, DBSchema } from '../../survey'

export class NavState {
	private curItem: Item;
	private items: Item[];

	public constructor(items: Item[], cur_item?: Item) {
		this.items = items;
		if (cur_item) {
			this.curItem = cur_item;
		} else {
			this.curItem = this.items[0];
		}
	}

	public getId(): string {
		return this.curItem.id;
	}
	public getIdx(): number {
		return this.items.findIndex((val, idx)=>val.id===this.curItem.id);
	}
	public getCurItem(): Item {
		return this.curItem;
	}
	public getItems(): Item[] {
		return this.items;
	}
	public next() {
		if (this.getIdx() + 1 < this.items.length) {
			this.set(this.items[this.getIdx() + 1]);
		}
	}
	public prev() {
		if (this.getIdx() !== 0) {
			this.set(this.items[this.getIdx() - 1]);
		}
	}
	public set(item: Item):boolean {
		// if (!this.items.includes(item)) { return false; }
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].id == item.id) {
				this.curItem = this.items[i];
				return true;
			}
		}
		return false;
	}

}

export class PageNav extends NavState {

}

export class FolderNav extends NavState {

	public findFolderOfPage(page: Item):Item {
		const folders = this.getItems();
		for (let i = 0; i < folders.length; i++) {
			const pages = folders[i].items;
			for (let j = 0; j < pages.length; j++) {
				if (page.id === pages[j].id) {
					// folderIdx = i;
					// pageIdx = j;
					return folders[i];
				}
			}
		}
		return undefined;
	}

}

export interface INavState {
	updateValues: (root: Item) => void;
	updateAndSet: (root: Item, folder?:Item, page?:Item) => void;
	updateAndSetWithIds: (root: Item, folderIdx?:number, pageIdx?:number) => void;

	getPages: () => Item[];
	nextPage: () => void;
	prevPage: () => void;
	setPage: (item: Item) => void;
	getPage: () => Item;
	getPageId: () => string;
	getPageIdx: () => number;

	getFolders: () => Item[];
	nextFolder: () => void;
	prevFolder: () => void;
	setFolder: (folder: Item, page?: Item) => void;
	getFolder: () => Item;
	getFolderId: () => string;
	getFolderIdx: () => number;

	getQuestions:() => Item[];

	getPagesOfFolder: (folder: Item) => Item[];

	getItemIdx: (id:string) => number;
	findItemById: (id:string) => Item;
	getItemType: (id:string) => string;
	getPathToId: (id:string) => string[];
	/**
	 *  returns a obj with key = question.id, value = idx || obj if question is section
	 */
	getItemsGlobalOrderIndex: () => any;
}

interface INavValue {
	root: Item;
	folders: Item[];
	folder: Item;
	pages: Item[];
	page: Item;
}

export class SurveyNav implements INavState {
	// private root: Item;
	private folders: FolderNav;
	private pages: PageNav;
	private root: Item;
	public constructor(value: INavValue) {
		this.root = value.root;
		this.folders = new FolderNav(value.folders, value.folder);
		this.pages = new PageNav(value.pages, value.page);
	}

	static rootToValue = (root: Item, folderIdx?:number, pageIdx?:number) => {
		if (typeof folderIdx === 'undefined') { folderIdx = 0; }
		if (typeof pageIdx === 'undefined') { pageIdx = 0; }
		return {
			root: root,
			folders: root.items,
			folder: root.items[folderIdx],
			pages: root.items[folderIdx].items,
			page: root.items[folderIdx].items[pageIdx]
		} as INavValue;
	}

	updateValues: (root: Item) => void;
	updateAndSet: (root: Item, folder?:Item, page?:Item) => void;
	updateAndSetWithIds: (root: Item, folderIdx?:number, pageIdx?:number) => void;
	
	public getPages():Item[] { return this.pages.getItems(); }
	public nextPage():any { this.pages.next(); return this.getValue(); }
	public prevPage():any  { this.pages.prev(); return this.getValue(); }
	public setPage(page: Item):any  {
		if (!this.pages.set(page)) {
			throw Error("page not in pages");
		}
		// TODO: handle if not in pages
		return this.getValue();
	}
	public getPage():Item { return this.pages.getCurItem(); }
	public getPageId():string { return this.pages.getId(); }
	public getPageIdx():number { return this.pages.getIdx(); }

	public getFolders():Item[] { return this.folders.getItems(); }
	public nextFolder():any  { this.folders.next(); return this.getValue(); }
	public prevFolder():any  { this.folders.prev(); return this.getValue(); }
	public setFolder(folder: Item, page?: Item):any  {
		this.folders.set(folder);
		this.pages = new PageNav(this.getFolder().items);
		if (page) {
			this.setPage(page);
		}
		return this.getValue();
	}
	public getFolder():Item { return this.folders.getCurItem(); }
	public getFolderId():string { return this.folders.getId(); }
	public getFolderIdx():number { return this.folders.getIdx(); }

	public getQuestions():Item[] { return this.pages.getCurItem().items; }

	public getPagesOfFolder(folder: Item): Item[] {
		return folder.items;
	}

	public getItemIdx (id:string):number {
		// BFS
		const queue:[Item,number][] = [[this.root,0]]
		while (queue.length !== 0) {
			const item = queue.shift()
			if (item[0].id === id) { return item[1]; }
			for (let i = 0; i < item[0].items.length; i++) {
				queue.push([item[0].items[i],i]);
			}
		}
		return -1;
	}

	public findItemById(id:string):Item {
		// BFS
		const queue:Item[] = [this.root]
		while (queue.length !== 0) {
			const item = queue.shift()
			if (item.id === id) { return item; }
			for (let i = 0; i < item.items.length; i++) {
				queue.push(item.items[i]);
			}
		}
		return undefined;
	}
	public getItemType (id:string):string {
		if (id === this.root.id) return SurveyMap.type;
		for (let f = 0; f < this.getFolders().length; f++) {
			const folder = this.getFolders()[f];
			if (folder.id === id) { return GroupMap.layout.style.folder; }
			for (let p = 0; p < folder.items.length; p++) {
				const page = folder.items[p];
				if (page.id === id) { return GroupMap.layout.style.page; }
					for (let q = 0; q < page.items.length; q++) {
						if (page.items[q].id === id) { return page.items[q].type; }
					}
				}
		}
		throw Error('this item is not a nav type');
	}

	public getPathToId (id: string):string[] {
		// BFS
		const queue:DBSchema[] = [this.root.getSchema()]
		let child:DBSchema = null;
		while (queue.length !== 0) {
			const item = queue.shift()
			if (item.id === id) { 
				child = item;
				break; 
			}
			for (let i = 0; i < item.items.length; i++) {
				item.items[i]['parent'] = item;
				queue.push(item.items[i]);
			}
		}
		if (typeof child === 'undefined' || child === null) { throw Error('child not exists for getPathToId'); }
		child = child['parent'];
		const ids:string[] = []
		while (typeof child !== 'undefined' && child !== null && typeof child['parent'] !== 'undefined' && child['parent'] !== null) {
			ids.push(child.id);
			child = child['parent'];
		}
		return ids.reverse();

		// let item = this.findItemById(id);
		// if (typeof item === 'undefined' || item === null) { throw Error('item not exists for getPathToId'); }
		// item = item.parent;
		// const ids = []
		// while (typeof item !== 'undefined' && item !== null && typeof item.parent !== 'undefined' && item.parent !== null) {
		// 	ids.push(item.id);
		// 	item = item.parent;
		// }
		// return ids.reverse();
	}

	/**
	 * 
	 * @returns a obj with key = question.id, value = idx || obj if question is section
	 */
	public getItemsGlobalOrderIndex():any {
		const order = {}
		let idx = 1
		for (let f = 0; f < this.getFolders().length; f++) {
			const folder = this.getFolders()[f];
			for (let p = 0; p < folder.items.length; p++) {
				const page = folder.items[p];
					for (let q = 0; q < page.items.length; q++) {
						const question = page.items[q];
						if (getQuestionMenuType(question) === QuestionMenuTypesMap.section.type) {
							order[question.id] = {};
							for (let s = 0; s < question.items.length; s++) {
								const secQs = question.items[s];
								order[question.id][secQs.id] = idx;
								idx+=1;
							}
						} else {
							order[question.id] = idx;
							idx+=1;
						}
					}
				}
		}
		return order;
	}

	public getValue(): INavValue {
		return {
			root: this.root,
			folders: this.getFolders(),
			folder: this.getFolder(),
			pages: this.getPages(),
			page: this.getPage()
		} as INavValue;
	}
	public setValue(value:INavValue) {
		this.root = value.root;
		this.folders = new FolderNav(value.folders);
		this.folders.set(value.folder);
		this.pages = new PageNav(value.pages);
		this.pages.set(value.page);
	}

}



export function useNavState(surveyRoot: Item): INavState {

	const [value, setValue] = React.useState(SurveyNav.rootToValue(surveyRoot));

	// console.log('nav value', value);

	function handleSetValue(val:any) {
		setValue(val);
	}

	return {
		updateValues: (root: Item) => {
			handleSetValue(SurveyNav.rootToValue(root));
		},
		updateAndSet: (root: Item, folder:Item, page:Item) => {
			// root for values, folder to select or page to select
			const nav = new SurveyNav(SurveyNav.rootToValue(root));
			handleSetValue(nav.setFolder(folder, page));
		},
		updateAndSetWithIds: (root: Item, folderIdx:number, pageIdx:number) => {
			// root for values, folder to select or page to select
			handleSetValue(SurveyNav.rootToValue(root,folderIdx,pageIdx));
		},

		getPage: () => new SurveyNav(value).getPage(),
		getPages: () => new SurveyNav(value).getPages(),
		nextPage: () => {handleSetValue(new SurveyNav(value).nextPage());},
		prevPage: () => {handleSetValue(new SurveyNav(value).prevPage());},
		setPage: (item: Item) => {handleSetValue(new SurveyNav(value).setPage(item));},
		getPageId: () => new SurveyNav(value).getPageId(),
		getPageIdx: () => new SurveyNav(value).getPageIdx(),

		getFolder: () => new SurveyNav(value).getFolder(),
		getFolders: () => new SurveyNav(value).getFolders(),
		nextFolder: () => {handleSetValue(new SurveyNav(value).nextFolder());},
		prevFolder: () => {handleSetValue(new SurveyNav(value).prevFolder());},
		setFolder: (folder: Item, page?: Item) => {handleSetValue(new SurveyNav(value).setFolder(folder, page));},
		getFolderId: () => new SurveyNav(value).getFolderId(),
		getFolderIdx: () => new SurveyNav(value).getFolderIdx(),

		getQuestions: () => new SurveyNav(value).getQuestions(),

		getPagesOfFolder: (folder: Item) => new SurveyNav(value).getPagesOfFolder(folder),

		getItemIdx: (id:string) => new SurveyNav(value).getItemIdx(id),
		findItemById: (id:string) => new SurveyNav(value).findItemById(id),
		getItemType: (id:string) => new SurveyNav(value).getItemType(id),
		getPathToId: (id:string) => new SurveyNav(value).getPathToId(id),
		getItemsGlobalOrderIndex: () => new SurveyNav(value).getItemsGlobalOrderIndex(),

	} as INavState;
}