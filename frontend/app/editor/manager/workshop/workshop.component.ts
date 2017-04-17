import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { EditorActions } from '../../../actions/editor.actions';

import { EditorService } from '../../editor.service';
import { LoggerService } from '../../../core/logger.service';
import { IItemCategory } from '../../../shared/interfaces/editor.interface';

@Component({
	moduleId: module.id,
  selector: 'as-editor-manager-workshop',
	templateUrl: 'workshop.component.html',
  styleUrls: [ 'workshop.component.css' ]
})
export class WorkshopComponent implements OnInit, OnDestroy {
	title = 'Home';

	/* Redux */
	private subscription : any[] = [];
	@select(['editor', 'item', 'categories']) itemCategories$ : Observable<Map<string, IItemCategory>>;
	private itemCategoriesData : Map<string, IItemCategory> = new Map();
	private itemCategories : Array<IItemCategory> = [];
	private itemCategoriesDisplay : Array<IItemCategory> = [];
	@select(['editor', 'item', 'activeCategory']) activeCategory$ : Observable<string>;
	private activeCategory : string = null;

	constructor (private ngRedux : NgRedux<any>,
							 private editorActions : EditorActions,
							 private editorService : EditorService,
							 private logger : LoggerService) {
	}
	ngOnInit () {
		this.subscription.push(this.activeCategory$.subscribe((data) => {
			this.activeCategory = data;
		}));
		this.subscription.push(this.itemCategories$.subscribe((data) => {
			this.itemCategoriesData = data;
			this.itemCategories = Array.from(data.values());
			this.itemCategoriesDisplay = this.itemCategories.filter((data) => data._pid === this.activeCategory);
			this.logger.info(`${this.constructor.name}:`, 'ngOnInit - Redux - itemCategories -', this.itemCategoriesDisplay);
			this.logger.info(`${this.constructor.name}:`, 'ngOnInit - Redux - itemCategories -', this.itemCategories);

			if (data.size === 0) {
				this.logger.info(`${this.constructor.name}:`, 'ngOnInit - Redux -', 'Load item catygories...');
				this.editorService.getItemCategories().subscribe((data) => {
					if (data.categories && data.categories.length !== 0) {
						this.ngRedux.dispatch(this.editorActions.addItemCategories(data.categories));
					}
				}, (error) => {});
			}
		}));
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}
}
