import { Point, IPoint } from './point.class';

export interface ISurface {
	x : number;
	y : number;
	tStroke ?: string;
	tFill ?: string;
	points : Array<IPoint>;
	id ?: number;
}

export class Surface implements ISurface {
	private _x : number;							// Смещение по X от верхнего левого угла
	private _y : number;							// Смещение по Y от верхнего левого угла
	private _tStroke : string;				// Текстура границы поверхности
	private _tFill : string;					// Текстура поверхности
	private _points : Array<Point>;		// Массив точек, определяющие границы поверхности
	private _id : number;

	constructor (obj ?: ISurface) {
		if (obj) {
			this.x = obj.x || 0;
			this.y = obj.y || 0;
			this.tStroke = obj.tStroke || null;
			this.tFill = obj.tFill || null;
			this._points = obj.points.map((data : IPoint) => { return new Point(data); });
			this.id = obj.id || null;
		} else {
			this.x = 0;
			this.y = 0;
			this.tStroke = null;
			this.tFill = null;
			this.points = [];
			this.id = null;
		}
	}

	set x (data : number) {
		this._x = this.prepareNumberData(data);
	}
	get x () : number {
		return this._x;
	}
	set y (data : number) {
		this._y = this.prepareNumberData(data);
	}
	get y () : number {
		return this._y;
	}
	set tStroke (data : string) {
		this._tStroke = data && data.toString();
	}
	get tStroke () : string {
		return this._tStroke;
	}
	set tFill (data : string) {
		this._tFill = data && data.toString();
	}
	get tFill () : string {
		return this._tFill;
	}
	set points (data : Array<Point>) {
		this._points = data;
	}
	get points () : Array<Point> {
		return this._points;
	}
	set id (data : number) {
		this._id = this.prepareNumberData(data);
	}
	get id () : number {
		return this._id;
	}
	prepareNumberData (data : number) : number {
		return isFinite(data) ? data : 0;
	}

	/**
	 * poliPoints - возвращает строку с координатами для аттрибута points из
	 * полученных из массива точек surface.points.
	 *
	 * @class Surface
	 * @return {String}  description
	 */
	poliPoints () {
		return this.points.join(' ');
	}

	/**
	 * transform - возвращает строку для атрибута transform
	 *
	 * @class Surface
	 * @return {String}  description
	 */
	transform () {
		return `translate(${this.x}, ${this.y})`;
	}
}
