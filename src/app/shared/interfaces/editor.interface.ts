import { ISurface } from '../lib/surface.class';
import { IThing } from '../lib/thing.class';

export interface IWorkstate {
	type : string;
	model : any;
}

export interface IElement {
	type : string;
	id : number;
	capture : boolean;
}
export interface IEElement {
	target ?: EventTarget;
	clientX ?: number;
	clientY ?: number;
}

/* Editor Service */
export interface ITexture {
	_id : string;
	_cid : string;
	url : string;
	width : number;
	height : number;
}
export interface IRTexture {
	textures : Array<ITexture>;
}

export interface ITextureCategory {
	_id : string;
	name : string;
}
export interface IRTextureCategory {
	categories : Array<ITextureCategory>;
}

export interface IItem {
	_id : string;
	_cid : string;
	type : string;
	preview : string;
	payload : ISurface | IThing;
}
export interface IRItem {
	items : Array<IItem>;
}

export interface IItemCategory {
	_id : string;
	_pid : string;
	name : string;
}
export interface IRItemCategory {
	categories : Array<IItemCategory>;
}
