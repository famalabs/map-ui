import { Question, SurveyItem } from '@src/core/schema';
import React from 'react'


export class NavState {
    private curItem: SurveyItem;
    private items: SurveyItem[];

    public constructor(items: SurveyItem[], cur_item?: SurveyItem) {
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
    public getCurItem(): SurveyItem {
        return this.curItem;
    }
    public getItems(): SurveyItem[] {
        return this.items;
    }
    public next() {
        if (this.getIdx() + 1 < this.items.length) {
            this.set(this.items[this.getIdx() + 1]);
        }
    }
    public prev() {
        if (this.getIdx() - 1 > 0) {
            this.set(this.items[this.getIdx() - 1]);
        }
    }
    public set(item: SurveyItem):boolean {
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

    public findFolderOfPage(page: SurveyItem):SurveyItem {
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
    updateValues: (root: SurveyItem) => void;
    updateAndSet: (root: SurveyItem, folder?:SurveyItem, page?:SurveyItem) => void;
    updateAndSetWithIds: (root: SurveyItem, folderIdx?:number, pageIdx?:number) => void;

    getPages: () => SurveyItem[];
    nextPage: () => void;
    prevPage: () => void;
    setPage: (item: SurveyItem) => void;
    getPage: () => SurveyItem;
    getPageId: () => string;
    getPageIdx: () => number;

    getFolders: () => SurveyItem[];
    nextFolder: () => void;
    prevFolder: () => void;
    setFolder: (folder: SurveyItem, page?: SurveyItem) => void;
    getFolder: () => SurveyItem;
    getFolderId: () => string;
    getFolderIdx: () => number;

    getQuestions:() => SurveyItem[];

    getPagesOfFolder: (folder: SurveyItem) => SurveyItem[];
}

export class SurveyNav implements INavState {
    // private root: SurveyItem;
    private folders: FolderNav;
    private pages: PageNav;
    public constructor(value: any) {
            this.folders = new FolderNav(value.folders, value.folder);
            this.pages = new PageNav(value.pages, value.page);
    }

    static rootToValue = (root: SurveyItem, folderIdx?:number, pageIdx?:number) => {
        if (typeof folderIdx === 'undefined') { folderIdx = 0; }
        if (typeof pageIdx === 'undefined') { pageIdx = 0; }
        return {
            folders: root.items,
            folder: root.items[folderIdx],
            pages: root.items[folderIdx].items,
            page: root.items[folderIdx].items[pageIdx]
        }
    }

    updateValues: (root: SurveyItem) => void;
    updateAndSet: (root: SurveyItem, folder?:SurveyItem, page?:SurveyItem) => void;
    updateAndSetWithIds: (root: SurveyItem, folderIdx?:number, pageIdx?:number) => void;
    
    public getPages():SurveyItem[] { return this.pages.getItems(); }
    public nextPage():any { this.pages.next(); return this.getValue(); }
    public prevPage():any  { this.pages.prev(); return this.getValue(); }
    public setPage(page: SurveyItem):any  {
        if (!this.pages.set(page)) {
            throw Error("page not in pages");
        }
        // TODO: handle if not in pages
        return this.getValue();
    }
    public getPage():SurveyItem { return this.pages.getCurItem(); }
    public getPageId():string { return this.pages.getId(); }
    public getPageIdx():number { return this.pages.getIdx(); }

    public getFolders():SurveyItem[] { return this.folders.getItems(); }
    public nextFolder():any  { this.folders.next(); return this.getValue(); }
    public prevFolder():any  { this.folders.prev(); return this.getValue(); }
    public setFolder(folder: SurveyItem, page?: SurveyItem):any  {
        this.folders.set(folder);
        this.pages = new PageNav(this.getFolder().items);
        if (page) {
            this.setPage(page);
        }
        return this.getValue();
    }
    public getFolder():SurveyItem { return this.folders.getCurItem(); }
    public getFolderId():string { return this.folders.getId(); }
    public getFolderIdx():number { return this.folders.getIdx(); }

    public getQuestions():SurveyItem[] { return this.pages.getCurItem().items as Question[]; }

    public getPagesOfFolder(folder: SurveyItem): SurveyItem[] {
        return folder.items;
    }

    public getValue(): any {
        return {
            folders: this.getFolders(),
            folder: this.getFolder(),
            pages: this.getPages(),
            page: this.getPage()
        }
    }
    public setValue(value:any) {
        this.folders = new FolderNav(value.folders);
        this.folders.set(value.folder);
        this.pages = new PageNav(value.pages);
        this.pages.set(value.page);
    }

}



export function useNavState(root: SurveyItem): INavState {

    const [value, setValue] = React.useState(SurveyNav.rootToValue(root));
    function handleSetValue(value:any) {
        setValue(value);
    }

    return {
        updateValues: (root: SurveyItem) => {
            handleSetValue(SurveyNav.rootToValue(root));
        },
        updateAndSet: (root: SurveyItem, folder:SurveyItem, page:SurveyItem) => {
            // root for values, folder to select or page to select
            const nav = new SurveyNav(SurveyNav.rootToValue(root));
            handleSetValue(nav.setFolder(folder, page));
        },
        updateAndSetWithIds: (root: SurveyItem, folderIdx:number, pageIdx:number) => {
            // root for values, folder to select or page to select
            handleSetValue(SurveyNav.rootToValue(root,folderIdx,pageIdx));
        },

        getPage: () => new SurveyNav(value).getPage(),
        getPages: () => new SurveyNav(value).getPages(),
        nextPage: () => {handleSetValue(new SurveyNav(value).nextPage());},
        prevPage: () => {handleSetValue(new SurveyNav(value).prevPage());},
        setPage: (item: SurveyItem) => {handleSetValue(new SurveyNav(value).setPage(item));},
        getPageId: () => new SurveyNav(value).getPageId(),
        getPageIdx: () => new SurveyNav(value).getPageIdx(),

        getFolder: () => new SurveyNav(value).getFolder(),
        getFolders: () => new SurveyNav(value).getFolders(),
        nextFolder: () => {handleSetValue(new SurveyNav(value).nextFolder());},
        prevFolder: () => {handleSetValue(new SurveyNav(value).prevFolder());},
        setFolder: (folder: SurveyItem, page?: SurveyItem) => {handleSetValue(new SurveyNav(value).setFolder(folder, page));},
        getFolderId: () => new SurveyNav(value).getFolderId(),
        getFolderIdx: () => new SurveyNav(value).getFolderIdx(),

        getQuestions: () => new SurveyNav(value).getQuestions(),

        getPagesOfFolder: (folder: SurveyItem) => new SurveyNav(value).getPagesOfFolder(folder),

    } as INavState;
}