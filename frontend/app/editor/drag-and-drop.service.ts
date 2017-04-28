import { Injectable, OnDestroy } from '@angular/core';

import { NgRedux } from '@angular-redux/store';
import { EditorActions } from '../actions/editor.actions';

import { LoggerService } from '../core/logger.service';

interface Element {
	type : string;
	id : number;
}

@Injectable()
export class DragAndDropService implements OnDestroy {
	private startX : number;					// Начальная координата нажатия по оси X
	private startY : number;					// Начальная координата нажатия по оси Y
	private shiftX : number;					// Сдвиг по оси X относительно предыдущего значения мыши
	private shiftY : number;					// Сдвиг по оси Y относительно предыдущего значения мыши

	private precision : number = 3;		// Размер мёртвой зоны (ширина и высота)

	private isWorkspace : boolean;		// Нажато над Workspace (пустой рабочей зоной)?
	private isElement : boolean;			// Нажато над Element	(элементом)?
	private isCaptured : boolean;			// Element захвачен (был одиночный клик ранее)?
	private isMouseDown : boolean;		// Нажата ли левая кнопка мыши над областью?
	private isMove : boolean;					// Было ли движение мыши (с учётом мёртвой зоны)?
	private isLeave : boolean;				// Покинута ли рабочая зона?

	private element : Element = null;
	private target : Element = null;

	/* Redux */
	private subscription : any[] = [];

	constructor (private ngRedux : NgRedux<any>,
							 private editorActions : EditorActions,
						 	 private logger : LoggerService) {
		this.initData();
		this.isCaptured = false;
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}

	initData () {
		this.isElement = false;
		this.isWorkspace = false;
		this.isMouseDown = false;
		this.isMove = false;
		this.isLeave = false;
		this.target = null;
		this.ngRedux.dispatch(this.editorActions.toggleMove(false));
	}

	detectLeftButton (event : any) : boolean {
		if ('buttons' in event) {
			return event.buttons === 1;
		}
		return (event.which || event.button) === 1;
	}

	onMouseDown (event : any) {
		if (!this.detectLeftButton(event)) {
			return false;
		}

		this.initData();
		this.isMouseDown = true;

		let el : any = event.target.closest('.draggable');
		this.logger.info(`${this.constructor.name}:`, 'onMouseDown - el -', el);

		if (el) {
			this.isElement = true;
			this.target = {
				type : el.dataset.type,
				id : +el.dataset.id
			};
			this.logger.info(`${this.constructor.name}:`, 'onMouseDown - element - type -', this.target.type);
			this.logger.info(`${this.constructor.name}:`, 'onMouseDown - element - id -', this.target.id);

			if (this.isCaptured && this.element) {
				if (this.element.type !== this.target.type || this.element.id !== this.target.id) {
					this.isWorkspace = true;
				}
			} else if (el.dataset.type === 'surface') {
				this.element = {
					type : el.dataset.type,
					id : +el.dataset.id
				};
			}
		} else {
			this.isWorkspace = true;
		}

		this.logger.info(`${this.constructor.name}:`, 'onMouseDown - isElement -', this.isElement);
		this.logger.info(`${this.constructor.name}:`, 'onMouseDown - isCaptured -', this.isCaptured);
		this.logger.info(`${this.constructor.name}:`, 'onMouseDown - isWorkspace -', this.isWorkspace);

		this.startX = event.clientX;
		this.startY = event.clientY;
		this.shiftX = this.startX;
		this.shiftY = this.startY;

		event.preventDefault();
	}
	onMouseMove (event : any) {
		if (!this.isMouseDown) {
			return;
		}
		if (!this.isMove) {
			if (Math.abs(event.clientX - this.startX) < this.precision &&
					Math.abs(event.clientY - this.startY) < this.precision) {
				return false;
			}
			this.ngRedux.dispatch(this.editorActions.toggleMove(true));
			this.isMove = true;
		}

		let dX = event.clientX - this.shiftX;
		let dY = event.clientY - this.shiftY;
		this.shiftX = event.clientX;
		this.shiftY = event.clientY;

		if (this.isWorkspace || !this.isCaptured) {
			this.ngRedux.dispatch(this.editorActions.translateWorkspace(dX, dY));
			// Data sending to redux
		} else {
			if (this.element.type === 'surface') {
				this.ngRedux.dispatch(this.editorActions.translateSurface(this.element.id, dX, dY));
			}
		}
		event.preventDefault();
	}
	onMouseUp (event : any) {
		if (this.isLeave) {
			this.logger.info(`${this.constructor.name}:`, 'onMouseUp - isLeave -', this.isLeave);
			return;
		}
		if (!this.isMove) {
			if (this.isWorkspace) {
				this.isCaptured = this.isElement;
				this.element = this.target;
			} else {
				this.isCaptured = true;
			}
		}
		this.logger.info(`${this.constructor.name}:`, 'onMouseUp - isMove -', this.isMove);
		this.logger.info(`${this.constructor.name}:`, 'onMouseUp - isCaptured -', this.isCaptured);
		this.initData();
		event.preventDefault();
	}
	onMouseLeave (event : any) {
		this.logger.info(`${this.constructor.name}:`, 'onMouseLeave - isLeave -', this.isLeave);
		this.initData();
		this.isLeave = true;
	}
}
