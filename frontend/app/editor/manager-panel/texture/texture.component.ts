import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { EditorActions } from '../../../actions/editor.actions';

import { LoggerService } from '../../../core/logger.service';
import { ITexture, ITextureCategory } from '../../../shared/interfaces/editor.interface';

@Component({
	moduleId: module.id,
  selector: 'as-editor-manager-texture',
	templateUrl: 'texture.component.html',
  styleUrls: [ 'texture.component.css' ]
})
export class TextureComponent implements OnInit, OnDestroy {
	/* Private variable */
	private activeTextureId : string = null;
	private activeTextureCategoryId : string = '';

	/* Redux */
	private subscription : any[] = [];
	@select(['editor', 'texture', 'categories']) textureCategories$ : Observable<Map<string, ITextureCategory>>;
	private textureCategoriesData : Map<string, ITextureCategory> = new Map();
	private textureCategories : Array<ITextureCategory> = [];
	@select(['editor', 'texture', 'textures']) textures$ : Observable<Map<string, ITexture>>;
	private textures : Array<ITexture> = [];
	private texturesDisplay : Array<ITexture> = [];

	constructor (private ngRedux : NgRedux<any>,
							 private editorActions : EditorActions,
						 	 private logger : LoggerService) {
		this.activeTextureId = null;
	}
	ngOnInit () {
		this.subscription.push(this.textureCategories$.subscribe((data) => {
			this.textureCategoriesData = data;
			this.textureCategories = data ? Array.from(data.values()) : [];
		}));

		this.subscription.push(this.textures$.subscribe((data) => {
			this.textures = Array.from(data.values());

			if (data.size !== 0) {
				this.texturesDisplay = this.textures.filter((d2) => d2._cid === this.activeTextureCategoryId);
			}
		}));
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * getSrcTexture - функция, возвращающая путь к изображениям с текстурами.
	 *
	 * @kind {function}
	 * @param  {texture} ITexture - объект с данными о текстуре
	 * @return {type}
	 */
	getSrcTexture (texture : ITexture) {
		return `assets/textures/${texture.url}`;
	}

	/**
	 * onClickSetTexture - событие, отслеживающее выбор текстуры и отвечающее за
	 * фиксацию полученых данных.
	 *
	 * @kind {event}
	 * @param  {event} MouseEvent
	 * @return {type}
	 */
	onClickSetTexture (event : MouseEvent) {
		let el : Element = (<HTMLElement>event.target).closest('.item');
		if (!el) {
			return;
		}
		this.logger.info(`${this.constructor.name}:`, 'onClickSetTexture -', el);
		if (!el.getAttribute('data-item-id')) {
			return;
		}
		let itemId : string = el.getAttribute('data-item-id').toString();
		this.logger.info(`${this.constructor.name}:`, 'onClickSetTexture -', itemId);
		this.activeTextureId = itemId;
	}

	/**
	 * onChangeTextureCategory - событие, отслеживающее изменение категории текстур и
	 * выполняющее фильтрацию списка отображаемых текстур.
	 *
	 * @kind {event}
	 * @param  {event} Event
	 * @return {type}
	 */
	onChangeTextureCategory (event : Event) {
		this.logger.info(`${this.constructor.name}:`, 'onChangeTextureCategory -',
			`${this.activeTextureCategoryId} = ${this.textureCategoriesData.get(this.activeTextureCategoryId).name}`);

		this.texturesDisplay = this.textures.filter((data) => data._cid === this.activeTextureCategoryId);
	}

	/**
	 * onClickBack - событие, отвечающее за переход в панель 'Workstate'.
	 *
	 * @kind {event}
	 * @return {type}
	 */
	onClickBack () {
		this.ngRedux.dispatch(this.editorActions.openManagerPanel('workstate'));
	}
}