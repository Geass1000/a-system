import { Reducer } from 'redux';
import { IAction } from '../shared/interfaces/action.interface';
import { ModalActions } from '../actions/modal.actions';

export interface IModal {
	open : boolean,
	active : string,
	/* Auth Modals */
	login : boolean,
	signup : boolean,
	reset : boolean,
	/* Editor Modals */
	initWorkspace : boolean
}

export const INITIAL_STATE : IModal = {
	open : false,
	active : null,
	/* Auth Modals */
	login : false,
	signup : false,
	reset : false,
	/* Editor Modals */
	initWorkspace : false
};

export const ModalReducer : Reducer<IModal> = (state = INITIAL_STATE, action : IAction) : IModal => {
	switch (action.type) {
		case ModalActions.OPEN_MODAL : {
			let modal = Object.assign({}, state, {
				open : action.payload.state,
				active : action.payload.name
			});
			modal[action.payload.name] = true;
			return modal;
		}
		case ModalActions.CLOSE_ACTIVE_MODAL : {
			let modal = Object.assign({}, state, { open : false });
			modal[modal.active] = false;
			modal.active = null;
			return modal;
		}
	}
	return state
}
