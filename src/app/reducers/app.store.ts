import { combineReducers } from 'redux';

/* Store Interfaces */
import { IModal } from './modal.reducer';
import { IUser } from './user.reducer';
import { IState } from './state.reducer';
import { IEditorState } from './editor/state.reducer';
import { IEditorTexture } from './editor/texture.reducer';
import { IEditorManager } from './editor/manager.reducer';
import { IEditorItem } from './editor/item.reducer';
import { IEditorProject } from './editor/project.reducer';

/* Reducers */
import { ModalReducer } from './modal.reducer';
import { UserReducer } from './user.reducer';
import { StateReducer } from './state.reducer';
import { EditorStateReducer } from './editor/state.reducer';
import { EditorTextureReducer } from './editor/texture.reducer';
import { EditorManagerReducer } from './editor/manager.reducer';
import { EditorItemReducer } from './editor/item.reducer';
import { EditorProjectReducer } from './editor/project.reducer';

/* Store Initial States */
import { INITIAL_STATE as INITIAL_STATE_MODAL } from './modal.reducer';
import { INITIAL_STATE as INITIAL_STATE_USER } from './user.reducer';
import { INITIAL_STATE as INITIAL_STATE_STATE } from './state.reducer';
import { INITIAL_STATE as INITIAL_STATE_EDITOR_STATE } from './editor/state.reducer';
import { INITIAL_STATE as INITIAL_STATE_EDITOR_TEXTURE } from './editor/texture.reducer';
import { INITIAL_STATE as INITIAL_STATE_EDITOR_MANAGER } from './editor/manager.reducer';
import { INITIAL_STATE as INITIAL_STATE_EDITOR_ITEM } from './editor/item.reducer';
import { INITIAL_STATE as INITIAL_STATE_EDITOR_PROJECT } from './editor/project.reducer';

/* Second Interface */
interface IEditor {
	state : IEditorState;
	texture : IEditorTexture;
	manager : IEditorManager;
	item : IEditorItem;
	project : IEditorProject;
}

/* Store Interface */
export interface IApp {
	state : IState;
	modal : IModal;
	user : IUser;
	editor : IEditor;
}

/* Store Initial State */
export const INITIAL_STATE : IApp = {
	state : INITIAL_STATE_STATE,
	modal : INITIAL_STATE_MODAL,
	user : INITIAL_STATE_USER,
	editor : {
		state : INITIAL_STATE_EDITOR_STATE,
		texture : INITIAL_STATE_EDITOR_TEXTURE,
		manager : INITIAL_STATE_EDITOR_MANAGER,
		item : INITIAL_STATE_EDITOR_ITEM,
		project : INITIAL_STATE_EDITOR_PROJECT
	}
};

/* Combine State Reducers */
export const AppReducer = combineReducers<IApp>({
	state : StateReducer,
	modal : ModalReducer,
	user : UserReducer,
	editor : combineReducers<IEditor>({
		state : EditorStateReducer,
		texture : EditorTextureReducer,
		manager : EditorManagerReducer,
		item : EditorItemReducer,
		project : EditorProjectReducer
	})
});
