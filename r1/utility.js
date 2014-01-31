function clamp(x, a, b) {
    return Math.min(Math.max(x, a), b)
};

var range = function range(icurrent, imin, imax, iminHitCallback, imaxHitCallback) {

    var _minHitCallback;
    Object.defineProperty(this, "minHitCallback", {
        get: function() {

            return _minHitCallback;
        },
        set: function(value) {
            if (value !== _minHitCallback) {
                if (typeof(value) == "function") {
                    _minHitCallback = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });

    var _maxHitCallback;
    Object.defineProperty(this, "minHitCallback", {
        get: function() {

            return _maxHitCallback;
        },
        set: function(value) {
            if (value !== _maxHitCallback) {
                if (typeof(value) == "function") {
                    _maxHitCallback = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });



    var _current = 0;
    Object.defineProperty(this, "current", {
        get: function() {

            return _current;
        },
        set: function(value) {
            if (value !== _current) {
                _current = clamp(value, _min, _max);
                if (_current == this.max) {
                    if (this.maxHitCallback) {
                        this.maxHitCallback();
                    }
                }
                if (_current == this.min) {
                    if (this.minHitCallback) {
                        this.minHitCallback();
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    var _min = 0;
    Object.defineProperty(this, "min", {
        get: function() {

            return _min;
        },
        set: function(value) {

            if (value !== _min) {
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
        configurable: true
    });
    var _max = 0;
    Object.defineProperty(this, "max", {
        get: function() {

            return _max;
        },
        set: function(value) {
            if (value !== _max) {
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
        configurable: true
    });

    Object.defineProperty(this, "percentage", {
        get: function() {
            return ((this.current - this.min) / (this.max - this.min)) * 100;
        },
        set: function(value) {
            this.current = ((clamp(value, 0, 100) / 100) * (this.max - this.min)) + this.min;
        },
        enumerable: true,
        configurable: true
    });
    this.minHitCallback = iminHitCallback;
    this.maxHitCallback = imaxHitCallback;
    this.max = imax;
    this.min = imin;
    this.current = icurrent;
};
range.prototype.setValues = function(icurrent, imin, imax) {
    this.min = imin;
    this.max = imax;
    this.current = icurrent;
};
range.prototype.apply = function(func) {
    "function" == typeof func && func(this);
};
range.prototype.shift = function(val) {
    this.max += val;
    this.current += val;
    this.min += val;
};
range.prototype.rangeLength = function() {
    return this.max - this.min;
};

range.prototype.addPercent = function(ipercent) {
    if (ipercent === 0) {
        return;
    }

    var perc = clamp(Math.abs(ipercent), 0, 100);
    var newval = ipercent > 0 ? this.getPercentage() + perc : this.getPercentage() - perc;
    this.setPercentage(newval);
};
range.prototype.setMinMaintain = function(val) {
    var perc = this.getPercentage();
    this.min = val;
    this.setPercentage(perc);
};
range.prototype.setMaxMaintain = function(val) {
    var perc = this.getPercentage();
    this.max = val;
    this.setPercentage(perc);
};
range.prototype.maximize = function() {
    this.setPercentage(100);
};
range.prototype.minimize = function() {
    this.setPercentage(0);
};


/*
var val = new range(3, 2, 10, function() {
    alert("min hit");
}, function() {
    alert("max hit");
});
console.log(val.current);
console.log(val.min);
console.log(val.max);
console.log(val.getPercentage());
val.setPercentage(50);
console.log(val.getPercentage());
console.log(val.current);
val.addPercent(-10);
console.log(val.getPercentage());
console.log(val.current);
val.addPercent(20);
console.log(val.getPercentage());
console.log(val.current);
val.current += 10;
console.log(val.getPercentage());
console.log(val.current);
val.current -= 20;
console.log(val.getPercentage());
console.log(val.current);
*/