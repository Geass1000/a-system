import { HelperClass } from './helper.class';

export interface IPoint {
	x ?: number;
	y ?: number;
}

export class Point implements IPoint {
	private _x : number;
	private _y : number;

	constructor (obj ?: IPoint) {
		if (obj) {
			this.x = obj.x || 0;
			this.y = obj.y || 0;
		} else {
			this.x = 0;
			this.y = 0;
		}
	}

	set x (data : number) {
		this._x = HelperClass.prepareData(data);
	}
	get x () : number {
		return this._x;
	}
	set y (data : number) {
		this._y = HelperClass.prepareData(data);
	}
	get y () : number {
		return this._y;
	}

	/**
	 * valueOf - функция, возвращающая объектное представление класса.
	 *
	 * @function
	 * @return {IPoint}
	 */
	valueOf () : IPoint {
		return {
			x : this.x,
			y : this.y
		};
	}

	/**
	 * toString - функция, возвращающая строковое представление класса.
	 *
	 * @function
	 * @return {string}
	 */
	toString () : string {
		return `${this.x},${this.y}`;
	}

	/**
	 * transform - возвращает строку для атрибута transform
	 *
	 * @class Point
	 * @return {String}  description
	 */
	transform () {
		return `translate(${this.x},${this.y})`;
	}
}
