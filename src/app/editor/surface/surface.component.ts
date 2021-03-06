import { Component, OnInit, OnDestroy } from '@angular/core';

/* App Redux and Request */
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import { EditorActions } from '../../actions/editor.actions';

/* App Services */
import { LoggerService } from '../../core/logger.service';

/* App Interfaces and Classes */
import { Surface } from '../../shared/lib/surface.class';
import { IElement } from '../../shared/interfaces/editor.interface';

@Component({
	moduleId: module.id,
  selector: '[as-editor-surface]',
	templateUrl: 'surface.component.html',
  styleUrls: [ 'surface.component.scss' ]
})
export class SurfaceComponent implements OnInit, OnDestroy {

	/* Redux */
	private subscription : Array<Subscription> = [];
	@select(['editor', 'state', 'activeElements']) activeElements$ : Observable<Array<IElement>>;
	private activeElements : Array<IElement>;
	@select(['editor', 'project', 'surfaces']) surfaces$ : Observable<Array<Surface>>;

	/* Public Variable */
	public surfaces : Array<Surface>;

	constructor (private ngRedux : NgRedux<any>,
							 private editorActions : EditorActions,
							 private logger : LoggerService) {
	}
	ngOnInit () {
		this.subscription.push(this.activeElements$.subscribe((data) => {
			this.activeElements = data;
			this.logger.info(`${this.constructor.name} - ngOnInit:`, 'Redux - activeElements -', this.activeElements);
		}));
		this.subscription.push(this.surfaces$.subscribe((data) => {
			this.surfaces = data;
		}));
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * isActiveSurface - функция, возвращающая истину, если элемент 'Surface' активен.
	 *
	 * @function
	 * @param  {number} index - номер элемента
	 * @return {boolean}
	 */
	isActiveSurface (index : number) : boolean {
		if (!this.activeElements || !this.activeElements.length) {
			return false;
		}
		return this.activeElements[0].type === 'surface' && this.activeElements[0].id === index;
	}

	/**
	 * isActivePoint - функция, возвращающая истину, если элемент 'Point' активен.
	 *
	 * @function
	 * @param  {number} index - номер элемента
	 * @return {boolean}
	 */
	isActivePoint (index : number) : boolean {
		if (!this.activeElements || this.activeElements.length < 2) {
			return false;
		}
		return this.activeElements[1].type === 'point' && this.activeElements[1].id === index;
	}

	/**
	 * trackBySurfaces - функция, возвращающая индекс элемента для trackBy директивы ngFor.
	 *
	 * @function
	 * @param {number} index - индекс элемента
	 * @param {Surface} data - элемент
	 * @return {number}
	 */
	trackBySurfaces (index : number, data : Surface) : number {
		return data.id;
	}
}
