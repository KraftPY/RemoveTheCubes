import { getRandom } from './services.js';

export default class Cube {

    constructor({ parent, color, size, position, isStart, callbacks }) {
        this.$parent = parent;
        this.$el = document.createElement('div');
        this._size = size;
        this._color = color;
        this._top = position.top;
        this._left = position.left;
        this._points = Math.round((100 - this._size) / 10 - 2);
        this._time = null;
        this.removeFromArray = callbacks.removeFromArray;
        this.upPointsEvent = callbacks.upPointsEvent;
        this.upTimeEvent = callbacks.upTimeEvent;
        this._clickHandler = this._click.bind(this);
        this._init(isStart);
    }

    _init(isStart) {
        this.$el.style.width = this._size + 'px';
        this.$el.style.height = this._size + 'px';
        this.$el.style.backgroundColor = this._color;
        this.$el.style.top = this._top + 'px';
        this.$el.style.left = this._left + 'px';
        this.$parent.append(this.$el);
        if (isStart && getRandom(1, 10) === 1) {
            this._timeCube();
        }
    }

    _click() {
        this.upPointsEvent(this._points);
        if (this._time) {
            this.upTimeEvent(this._time);
        }
        this.remove();
    }

    _timeCube() {
        const $span = document.createElement('span');
        this._time = this._points;
        this.$el.append($span);
        $span.innerHTML = this._time;
        const timerId = setInterval(() => {
            this._time--;
            $span.innerHTML = this._time;
            if (this._time === 0) {
                clearInterval(timerId);
                this.remove();
            }
        }, 1000);
    }

    addEventClick() {
        this.$el.addEventListener('click', this._clickHandler);
    }

    removeEventClick() {
        this.$el.removeEventListener('click', this._clickHandler);
    }

    remove() {
        this.$el.remove();
        this.removeFromArray(this);
    }

    get props() {
        return {
            size: this._size,
            top: this._top,
            left: this._left
        };
    }
}