import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { Config } from '../config';

/* App Redux and Request */
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import { EditorActions } from '../actions/editor.actions';

/* App Services */
import { LoggerService } from '../core/logger.service';

const Measure : Map<string, number> = new Map<string, number>([
	['m', 1],	['cm', 100], ['px', Config.scale]
]);

@Injectable()
export class MetricService implements OnDestroy {
	private defMeasure : string = Config.defMeasure;
	private prevMeasure : string = this.defMeasure;

	/* Redux */
	private subscription : Array<Subscription> = [];
	@select(['editor', 'state', 'isActiveMetric']) isActiveMetric$ : Observable<boolean>;
	private isActiveMetric : boolean = null;
	@select(['editor', 'state', 'curMeasure']) curMeasure$ : Observable<string>;
	private curMeasure : string = null;

	constructor (private ngRedux : NgRedux<any>,
							 private editorActions : EditorActions,
						 	 private logger : LoggerService) {
		this.subscription.push(this.isActiveMetric$.subscribe((data) => {
			this.isActiveMetric = data;
		}));
		this.subscription.push(this.curMeasure$.subscribe((data) => {
			this.deactive();
			this.prevMeasure = this.curMeasure ? this.curMeasure : this.prevMeasure;
			this.curMeasure = data;
			this.active();
		}));
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * active - функция, сигнализирующая о окончании смены единицы измерения.
	 *
	 * @function
	 * @return {void}
	 */
	active () : void {
		if (this.defMeasure && this.curMeasure) {
			this.logger.info(`${this.constructor.name}:`, `active - prevMeasure: ${this.prevMeasure}, curMeasure: ${this.curMeasure}`);
			this.ngRedux.dispatch(this.editorActions.activeMetric(true));
		}
	}

	/**
	 * deactive - функция, сигнализирующая о начале смены единицы измерения.
	 *
	 * @function
	 * @return {void}
	 */
	deactive () : void {
		if (this.isActiveMetric) {
			this.logger.info(`${this.constructor.name}:`, 'deactive');
			this.ngRedux.dispatch(this.editorActions.activeMetric(false));
		}
	}

	/**
	 * convertFromDefToCur - функция, выполняющая конвертацию числа 'num' из единицы
	 * измерения по умолчанию в текущую единицу измерения.
	 *
	 * @function
	 * @param {number|string} num - число
	 * @return {string}
	 */
	convertFromDefToCur (num : number | string) : string  {
		return this.convertor({ from : this.defMeasure, to : this.curMeasure }, num);
	}

	/**
	 * convertFromCurToDef - функция, выполняющая конвертацию числа 'num' из текущей
	 * единицы измерения в единицу измерения по умолчанию.
	 *
	 * @function
	 * @param {number|string} num - число
	 * @return {string}
	 */
	convertFromCurToDef (num : number | string) : string  {
		return this.convertor({ from : this.curMeasure, to : this.defMeasure }, num);
	}

	/**
	 * convertFromPrevToCur - функция, выполняющая конвертацию числа 'num' из предыдущей
	 * единицы измерения в текущую единицу измерения.
	 *
	 * @function
	 * @param {number|string} num - число
	 * @return {string}
	 */
	convertFromPrevToCur (num : number | string) : string  {
		return this.convertor({ from : this.prevMeasure, to : this.curMeasure }, num);
	}

	/**
	 * convertor - функция, выполняющая конвертацию числа 'num' из одной единцы измерения
	 * в другую (из 'dir.from' к 'dir.to'). Если 'num' не является числом, возвращается
	 * исходный параметр 'num' в виде строки.
	 *
	 * @function
	 * @param {Object} dir - объект конвертации
	 * @param {number|string} num - число
	 * @return {string}
	 */
	convertor (dir : { from : string, to : string }, num : number | string) : string {
		if (!(dir.from && dir.to) || !isFinite(+num)) {
			return num.toString();
		}

		const fromScale : number = Measure.get(dir.from);
		const toScale : number = Measure.get(dir.to);
		if (!(fromScale && toScale)) {
			return num.toString();
		};

		const cof : number = toScale / fromScale;
		const result : number = cof * (+num);
		return (+result.toFixed(10)).toString();
	}

	/**
	 * isFieldValid - функция, возвращающая истину, если палое 'fieldName' прошло валидацию.
	 *
	 * @function
	 * @param {FormGroup} form - экземпляр формы
	 * @param {string} fieldName - наименование поля
	 * @return {boolean}
	 */
	isFieldValid (form : FormGroup, fieldName : string) : boolean {
		if (!form || !fieldName) {
			throw new Error('isFieldValid: Not all args!');
		}
		const field : AbstractControl = form.get(fieldName);
		return field ? field.valid : null;
	}

	/**
	 * getFieldValue - функция, возвращающая значение поля формы.
	 *
	 * @function
	 * @param {FormGroup} form - экземпляр формы
	 * @param {string} fieldName - наименование поля
	 * @return {string}
	 */
	getFieldValue (form : FormGroup, fieldName : string) : string {
		if (!form || !fieldName) {
			throw new Error('getFieldValue: Not all args!');
		}
		const field : AbstractControl = form.get(fieldName);
		return field ? field.value.toString() : null;
	}

	/**
	 * getNumberFieldValueToDefMetric - функция, возвращающая значение поля в единицах
	 * измерения по умолчанию.
	 *
	 * @function
	 * @param {FormGroup} form - экземпляр формы
	 * @param {string} fieldName - наименование поля
	 * @return {number}
	 */
	getNumberFieldValueToDefMetric (form : FormGroup, fieldName : string) : number {
		if (!form || !fieldName) {
			throw new Error('getFieldValueToDefMetric: Not all args!');
		}
		if (!this.isActiveMetric) {
			return null;
		}
		const fieldValue : string = this.getFieldValue(form, fieldName);
		return isFinite(+fieldValue) ? +this.convertFromCurToDef(fieldValue) : null;
	}

	/**
	 * updateFormValueToCurMetric - функция, выполняющая преобразование значения поля
	 * 'fieldName' к новой единице измерения.
	 *
	 * @function
	 * @param {FormGroup} form - экземпляр формы
	 * @param {string} fieldName - наименование поля
	 * @return {boolean}
	 */
	updateFormValueToCurMetric (form : FormGroup, fieldName : string) : boolean {
		if (!form || !fieldName) {
			throw new Error('updateFormValueToCurMetric: Not all args!');
		}
		if (!this.isActiveMetric) {
			return false;
		}
		this.logger.info(`${this.constructor.name}:`, `updateFormValue - ${fieldName}`);
		const fieldValue : string = this.getFieldValue(form, fieldName);
		if (!isFinite(+fieldValue)) {
			return false;
		}

		const obj = {};
		obj[fieldName] = this.convertFromPrevToCur(fieldValue).toString();
		form.patchValue(obj);
		return true;
	}
}
