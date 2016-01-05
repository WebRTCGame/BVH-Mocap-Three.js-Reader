    function clamp(x, a, b) {
        return Math.min(Math.max(x, a), b)
    };

    function isNumber(a) {
        return 'number' === typeof a;
    };

    function isFunction(a) {
        return 'function' === typeof a;
    };

    var range = function range(icurrent, imin, imax, iminHitCallback, imaxHitCallback) {
        'use strict';
        var _minHitCallback,
        _maxHitCallback,
        _current = 0,
            _min = 0,
            _max = 0;

        Object.defineProperties(this, {
            minHitCallback: {
                get: function () {
                    return _minHitCallback;
                },
                set: function (value) {
                    value !== _minHitCallback && isFunction(value) && (_minHitCallback = value);
                },
                enumerable: true,
                configurable: false
            },
            maxHitCallback: {
                get: function () {
                    return _maxHitCallback;
                },
                set: function (value) {
                    value !== _maxHitCallback && isFunction(value) && (_maxHitCallback = value);
                },
                enumerable: true,
                configurable: false
            },
            current: {
                get: function () {
                    return _current;
                },
                set: function (value) {
                    if (value !== _current && isNumber(value)) {
                        _current = clamp(value, _min, _max);
                        _current === this.max && this.maxHitCallback();
                        _current === this.min && this.minHitCallback();
                    }
                },
                enumerable: true,
                configurable: false
            },
            min: {
                get: function () {
                    return _min;
                },
                set: function (value) {
                    if (value !== _min && isNumber(value)) {
                        if (value >= this.max) {
                            value = this.max;
                            this.current = value;
                        }
                        if (value >= this.current) {
                            this.current = value;
                        }
                        _min = value;
                    }
                },
                enumerable: true,
                configurable: false
            },
            max: {
                get: function () {
                    return _max;
                },
                set: function (value) {
                    if (value !== _max && isNumber(value)) {
                        if (value <= this.min) {
                            this.min = value;
                            this.current = value;
                        }
                        if (value <= this.current) {
                            this.current = value;
                        }
                        _max = value;
                    }
                },
                enumerable: true,
                configurable: false
            },
            percentage: {
                get: function () {
                    return ((this.current - this.min) / (this.max - this.min)) * 100;
                },
                set: function (value) {
                    if (isNumber(value)) {
                        this.current = ((clamp(value, 0, 100) / 100) * (this.max - this.min)) + this.min;
                    }
                },
                enumerable: true,
                configurable: false
            }
        });

        this.minHitCallback = iminHitCallback || (function () {});
        this.maxHitCallback = imaxHitCallback || (function () {});
        this.max = imax || 0;
        this.min = imin || 0;
        this.current = icurrent || 0;
        return this;
    };
    range.prototype = {
        toArray: function () {
            return [this.current, this.min, this.max];
        },
        fromArray: function (arrayVal) {
            this.setValues(arrayVal[0], arrayVal[1], arrayVal[2]);
        },
        setValues: function (icurrent, imin, imax) {
            this.min = imin;
            this.max = imax;
            this.current = icurrent;
            return this;
        },
        apply: function (func) {
            isFunction(func) && func(this);
            return this;
        },
        shift: function (value) {
            0 !== value && isNumber(value) && (0 < value ? (this.max += value, this.current += value, this.min += value) : (this.min += value, this.current += value, this.max += value));
            return this;
        },
        shiftByPercent: function (value){
        var num = ((clamp(value, 0, 100) / 100) * (this.max - this.min)) + this.min;
        },
        rangeLength: function () {
            return this.max - this.min;
        },
        addPercent: function (value) {
            if (0 !== value && isNumber(value)) {
                var perc = clamp(Math.abs(value), 0, 100);
                this.percentage = 0 < value ? this.percentage + perc : this.percentage - perc;
            }
            return this;
        },
        getUnboundPercent: function (value){
            if (isNumber(value)) {
                if(value === 0){return this.min};
                return ((value / 100) * (this.max - this.min)) + this.min;
            }},
        addUnboundPercent: function (value){
        this.current += this.getUnboundPercent(value);
        },
        setMinMaintain: function (value) {
            var perc = this.percentage;
            this.min = value;
            this.percentage = perc;
            return this;
        },
        setMaxMaintain: function (value) {
            var perc = this.percentage;
            this.max = value;
            this.percentage = perc;
            return this;
        },
        maximize: function () {
            this.percentage = 100;
            return this;
        },
        minimize: function () {
            this.percentage = 0;
            return this;
        }
    };


    var val = new range(3, 2, 10, function () {
        console.log("**************** min hit");
    });

    console.log("--------------");
    console.log("----Test 1----");
    console.log(JSON.stringify(val));
    console.log("--------------");
    console.log("----Test 2----");
    val.percentage = 50;
    console.log(JSON.stringify(val));
    console.log("--------------");
    console.log("----Test 3----");
    val.addPercent(-10);
    console.log(JSON.stringify(val));
    val.max += 1;
    val.addPercent(20).max += 1;
    console.log(JSON.stringify(val));
    console.log("--------------");
    console.log("----Test 4----");
    val.maxHitCallback = function () {
        console.log("**************** max hit");
    };
    val.current += 10;
    console.log(JSON.stringify(val));
    val.current -= 20;
    console.log(JSON.stringify(val));
    console.log("--------------");
    console.log("----Test 5----");
    val.current = 5;
    val.maxHitCallback = {};
    val.maxHitCallback = [];
    val.maxHitCallback = null;
    val.maxHitCallback = "one";
    val.maximize();
    console.log(JSON.stringify(val));
    val.shift(-4);
    console.log(JSON.stringify(val));
    console.log("--------------");
    console.log("----Test 6----");
    val.addPercent(200);
    console.log(JSON.stringify(val));
    val.addPercent(-300);
    console.log(JSON.stringify(val));