import { Directive, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { EditorActions } from '../actions/editor.actions';

import { LoggerService } from '../core/logger.service';

import { IElement } from '../shared/interfaces/editor.interface';

@Directive({
	selector : '[drag-and-drop]'
})
export class DragAndDropDirective implements OnInit, OnDestroy {
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

	//private element : IElement = null;
	private target : IElement = null;

	/* Redux */
	private subscription : any[] = [];
	@select(['editor', 'state', 'element']) element$ : Observable<IElement>;
	private element : IElement;

	constructor (private elementRef: ElementRef,
							 private ngRedux : NgRedux<any>,
							 private editorActions : EditorActions,
						 	 private logger : LoggerService) {
	}
	ngOnInit () {
		this.initData();
		this.isCaptured = false;
		this.subscription.push(this.element$.subscribe((data) => {
			this.element = data;
		}));
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

	@HostListener('mousedown', ['$event']) onMouseDown (event : MouseEvent) {
		if (!this.detectLeftButton(event)) {
			return false;
		}

		this.initData();
		this.isMouseDown = true;

		let el : any = (<SVGElement>event.target).closest('.draggable');
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
			}
		} else {
			this.isWorkspace = true;
			this.target = null;
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
	@HostListener('mousemove', ['$event']) onMouseMove (event : MouseEvent) {
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
	@HostListener('mouseup', ['$event']) onMouseUp (event : MouseEvent) {
		if (this.isLeave) {
			this.logger.info(`${this.constructor.name}:`, 'onMouseUp - isLeave -', this.isLeave);
			return;
		}
		if (!this.isMove) {
			if (this.isWorkspace) {
				this.isCaptured = this.isElement;
			} else {
				this.isCaptured = true;
			}
			this.ngRedux.dispatch(this.editorActions.setElement(this.target));
		}
		this.logger.info(`${this.constructor.name}:`, 'onMouseUp - isMove -', this.isMove);
		this.logger.info(`${this.constructor.name}:`, 'onMouseUp - isCaptured -', this.isCaptured);
		this.initData();
		event.preventDefault();
	}
	@HostListener('mouseleave', ['$event']) onMouseLeave (event : MouseEvent) {
		this.logger.info(`${this.constructor.name}:`, 'onMouseLeave - isLeave -', this.isLeave);
		this.initData();
		this.isLeave = true;
	}
}
