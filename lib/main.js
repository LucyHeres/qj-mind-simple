(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["qjmind"] = factory();
	else
		root["qjmind"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "./src/mind.js":
/*!*********************!*\
  !*** ./src/mind.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");


var isValueNull = function isValueNull(val) {
  return val === "" || val === null || val === undefined;
};

var qjm = function qjm(opts, fn) {
  this.opts = opts;
  this.fn = fn;
  this.canvasContainer = null;
  this.canvas = null;
  this.ctx = null;
  this.ratio = null;
  this.scale = 0.8;
  this.canvasCenterPos = {};
  this.allNodePosMap = {};
  this.mind = null;
  this.init();
};

qjm.prototype = {
  render: function render(data) {
    this.nodeJson = data;
    this.create_mind();
    this.add_event();
  },
  init: function init() {
    this.canvasContainer = document.querySelector(this.opts.container);
    this.canvas = document.createElement("canvas");
    this.canvasContainer.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    var w = this.canvasContainer.offsetWidth;
    var h = this.canvasContainer.offsetHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px"; // ????????????????????????

    var devicePixelRatio = window.devicePixelRatio || 1; // ??????????????????canvas????????????????????????????????????

    var backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio || this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio || this.ctx.backingStorePixelRatio || 1; // canvas?????????????????????

    this.ratio = devicePixelRatio / backingStoreRatio;
    this.canvas.width *= this.ratio;
    this.canvas.height *= this.ratio;
    this.canvasCenterPos = this.getCanvasCenterPos();
    this.ctx.scale(this.ratio, this.ratio); // ???????????????

    this.ctx.translate(this.canvasCenterPos.x, this.canvasCenterPos.y);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(-this.canvasCenterPos.x, -this.canvasCenterPos.y);
  },
  create_mind: function create_mind() {
    this.mind = new qjm.Mind(this, this.opts, this.nodeJson);
  },
  clearCanvas: function clearCanvas() {
    // ????????????????????????????????????????????????
    var cT = this.ctx.getTransform();
    var matrix = [cT.a, cT.b, cT.c, cT.d, cT.e, cT.f];

    var lt = this._getXY(matrix, 0, 0);

    var rb = this._getXY(matrix, this.canvasContainer.offsetWidth, this.canvasContainer.offsetHeight);

    this.ctx.clearRect(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
  },
  changeLayout: function changeLayout() {
    this.clearCanvas();
    this.mind.init();
  },
  // ??????????????????
  getCanvasCenterPos: function getCanvasCenterPos() {
    return {
      x: this.canvas.width / this.ratio / 2,
      y: this.canvas.height / this.ratio / 2
    };
  },
  add_event: function add_event() {
    this.add_event_zoom();
    this.add_event_dragmove();
    this.add_event_click();
  },
  add_event_zoom: function add_event_zoom() {
    var _this = this;

    // ????????????????????????
    window.addEventListener("mousewheel", function (event) {
      if (event.ctrlKey === true || event.metaKey) {
        event.preventDefault();
      }
    }, {
      passive: false
    }); //firefox

    window.addEventListener("DOMMouseScroll", function (event) {
      if (event.ctrlKey === true || event.metaKey) {
        event.preventDefault();
      }
    }, {
      passive: false
    }); // canvas??????

    this.canvas.addEventListener("wheel", function (e) {
      var zoom = 1;
      e.stopPropagation();
      e.preventDefault();

      if (e.ctrlKey) {
        if (e.deltaY > 0) zoom = 0.95;
        if (e.deltaY < 0) zoom = 1.05;
        if (_this.scale * zoom > 1.1 || _this.scale * zoom < 0.5) return;
        _this.scale *= zoom;

        _this.clearCanvas();

        _this.ctx.translate(e.offsetX, e.offsetY);

        _this.ctx.scale(zoom, zoom);

        _this.ctx.translate(-e.offsetX, -e.offsetY);

        requestAnimationFrame(function () {
          _this.mind.show_view();
        });
      }
    });
  },
  add_event_dragmove: function add_event_dragmove() {
    var t = this;
    var canvas = this.canvas;
    var isDown = false;
    var x, y;

    function _mousemove(e) {
      if (!isDown) return;
      t.clearCanvas();
      t.ctx.translate((e.clientX - x) / t.scale, (e.clientY - y) / t.scale);
      requestAnimationFrame(function () {
        t.mind.show_view();
      });
      x = e.clientX;
      y = e.clientY;
      return false;
    }

    function _mouseup(e) {
      //????????????
      canvas.style.cursor = "default";
      canvas.removeEventListener("mousemove", _mousemove);
      canvas.removeEventListener("mouseup", _mouseup);
      isDown = false;
    }

    canvas.addEventListener("mousedown", function (e) {
      //??????x?????????y??????
      x = e.clientX;
      y = e.clientY; //????????????

      isDown = true;
      canvas.style.cursor = "grabbing";
      canvas.addEventListener("mousemove", _mousemove);
      canvas.addEventListener("mouseup", _mouseup);
      return false;
    });
  },
  add_event_click: function add_event_click() {
    var _this2 = this;

    var canvas = this.canvas;
    var ctx = this.ctx;
    canvas.addEventListener("click", function (e) {
      // ????????????????????????????????????????????????
      var cT = ctx.getTransform();
      var matrix = [cT.a, cT.b, cT.c, cT.d, cT.e, cT.f];

      var newxy = _this2._getXY(matrix, e.offsetX, e.offsetY);

      var ex = newxy.x;
      var ey = newxy.y;
      var all_nodes = _this2.allNodePosMap; // ??????????????????

      for (var i = 0; i < all_nodes["keynode"].length; i++) {
        var p = all_nodes["keynode"][i];

        if (p.x - p.width / 2 <= ex && ex <= p.x + p.width / 2 && p.y - p.height / 2 <= ey && ey <= p.y + p.height / 2) {
          // console.log("?????????keynode:" + p.content, p.x, p.y);
          _this2.fn.keyNodeClick && _this2.fn.keyNodeClick(p);
          return;
        }
      } // ????????????????????????


      for (var type in all_nodes) {
        if (type == "keynode") continue;

        for (var i = 0; i < all_nodes[type].length; i++) {
          var _p = all_nodes[type][i];

          if (Math.pow(ex - _p[type][0], 2) + Math.pow(ey - _p[type][1], 2) < 100) {
            // console.log(`?????????${p.content}???hub??????${type}`);
            if (type == "hubPosLeft") _p.expandedLeft = !_p.expandedLeft;
            if (type == "hubPosRight") _p.expandedRight = !_p.expandedRight;
            if (type == "hubPos") _p.expanded = !_p.expanded;

            if (!_p.children || !_p.children.length) {
              _this2.fn.hubNodeClick && _this2.fn.hubNodeClick(_p);
            } else {
              _this2.changeLayout();
            }

            return;
          }
        }
      }
    });
  },
  // ????????????
  _getXY: function _getXY(matrix, mouseX, mouseY) {
    var newX = (mouseX * this.ratio - matrix[4]) / matrix[0];
    var newY = (mouseY * this.ratio - matrix[5]) / matrix[3];
    return {
      x: newX,
      y: newY
    };
  }
};
qjm.util = {
  throttle: function throttle(fn, wait) {
    var timer;
    return function () {
      var _arguments = arguments,
          _this3 = this;

      if (!timer) {
        timer = setTimeout(function () {
          fn.apply(_this3, _arguments);
          clearTimeout(timer);
          timer = null;
        }, wait);
      }
    };
  },
  newid: function newid() {
    return (new Date().getTime().toString(16) + Math.random().toString(16).substr(2)).substr(2, 16);
  },
  deepClone: function deepClone(obj) {
    var objClone = Array.isArray(obj) ? [] : obj instanceof Object ? {} : obj;

    if (obj && obj instanceof Array) {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i]) {
          objClone[i] = qjm.util.deepClone(obj[i]);
        }
      }
    } else if (obj && obj instanceof Object) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__.default)(obj[key]) === "object") {
            objClone[key] = qjm.util.deepClone(obj[key]);
          } else {
            objClone[key] = obj[key];
          }
        }
      }
    }

    return objClone;
  },
  flatArray: function flatArray(arr) {
    arr = [].concat(arr);
    var arr1 = [];
    arr.forEach(function (item) {
      if (item instanceof Array) {
        arr1 = arr1.concat(qjm.util.flatArray(item));
      } else {
        arr1.push(item);
      }
    });
    return arr1;
  }
}; // ??????????????????

qjm.KeyNode = function (qjm, nodeJson) {
  this.qjm = qjm;
  this.objectiveId = nodeJson.objectiveId || 0;
  this.text = nodeJson.text;
  this.shape = nodeJson.shape;
  this.x = nodeJson.x;
  this.y = nodeJson.y;
  this.width = qjm.opts.keyNodeWidth || 320;
  this.height = qjm.opts.keyNodeHeight || 100;
  this.hubRadius = qjm.opts.hubRadius || 10;
  this.lineColor = qjm.opts.lineColor || "#e3e4e5";
  this.childIndex = nodeJson.childIndex;
  this.rankIndex = nodeJson.rankIndex;
  this.direction = nodeJson.direction;
  this.isRoot = nodeJson.isRoot;
  this.parent = null;
  this.children = nodeJson.children;

  if (this.isRoot) {
    this.expandedLeft = nodeJson.expandedLeft;
    this.expandedRight = nodeJson.expandedRight;
    this.childrenCountLeft = nodeJson.childrenCountLeft;
    this.childrenCountRight = nodeJson.childrenCountRight;
    this.hubPosLeft = null;
    this.hubPosRight = null;
  } else {
    this.hubPos = null;
    this.expanded = nodeJson.expanded;
    this.childrenCount = nodeJson.childrenCount;
  }
};

qjm.KeyNode.prototype = {
  show: function show() {
    this.getHubPos();
    this.drawKeyNode();
    this.drawContent();
  },
  set_mind_pos_map: function set_mind_pos_map(type, nodePos) {
    var map = this.qjm.allNodePosMap;
    if (!map[type]) map[type] = [];
    map[type].push(nodePos);
  },
  drawKeyNode: function drawKeyNode() {
    var ctx = this.qjm.ctx;

    if (isValueNull(this.x) || isValueNull(this.y)) {
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(31,35,41,0.08)";
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
    this.set_mind_pos_map("keynode", this);
  },
  _drawText: function _drawText(str, x, y, w, h, fontsize, lineHeight, textAlign) {
    var ctx = this.qjm.ctx;
    ctx.textAlign = textAlign || "left";
    var currSumWidth = 0;
    var lineNum = 1;

    for (var i = 0; i < str.length; i++) {
      ctx.fillText(str[i], x + currSumWidth, y);
      currSumWidth += ctx.measureText(str[i]).width;
      if (i === str.length - 1) return;

      if (currSumWidth + ctx.measureText(str[i + 1]).width > w) {
        if (lineHeight * (lineNum + 1) > h) {
          ctx.fillText("...", x + currSumWidth, y);
          return;
        }

        y += lineHeight;
        lineNum += 1;
        currSumWidth = 0;
      }
    }
  },
  _drawCircle: function _drawCircle(left, top, r, centerText, bgcolor) {
    var ctx = this.qjm.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(left, top, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = bgcolor;
    ctx.fill();
    ctx.restore();
  },
  _drawRect: function _drawRect(left, top, w, h, bgcolor) {
    var ctx = this.qjm.ctx;
    ctx.save();
    ctx.fillStyle = bgcolor;
    ctx.fillRect(left, top, w, h);
    ctx.restore();
  },
  drawContent: function drawContent() {
    var ctx = this.qjm.ctx;
    var x0 = this.x - this.width / 2;
    var y0 = this.y - this.height / 2; // ?????????

    for (var i = 0; i < this.shape.length; i++) {
      var shapeobj = this.shape[i];

      if (shapeobj.type == "circle") {
        this._drawCircle(x0 + shapeobj.left, y0 + shapeobj.top, shapeobj.r, shapeobj.text, shapeobj.background);
      } else {
        this._drawRect(x0 + shapeobj.left, y0 + shapeobj.top, shapeobj.width, shapeobj.height, shapeobj.background);
      }
    } // ??????+?????????


    for (var i = 0; i < this.text.length; i++) {
      var textobj = this.text[i];
      ctx.save();
      ctx.font = textobj.fontsize + "px April";
      ctx.fillStyle = textobj.color;
      ctx.textBaseline = "top";

      this._drawText(textobj.value, x0 + textobj.left, y0 + textobj.top, textobj.width, textobj.height, textobj.fontsize, textobj.lineHeight, textobj.textAlign);

      ctx.restore();
    }
  },
  drawLine_to_child: function drawLine_to_child() {
    var ctx = this.qjm.ctx;
    ctx.save();

    if (this.isRoot) {
      if (this.childrenCountRight) {
        ctx.beginPath();
        ctx.moveTo(this.x + 1 * this.width / 2, this.y);
        ctx.strokeStyle = this.lineColor;
        ctx.lineTo(this.hubPosRight[0], this.hubPosRight[1]);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        this.drawHub(this.hubPosRight, this.childrenCountRight);
      }

      if (this.childrenCountLeft) {
        ctx.beginPath();
        ctx.moveTo(this.x + -1 * this.width / 2, this.y);
        ctx.strokeStyle = this.lineColor;
        ctx.lineTo(this.hubPosLeft[0], this.hubPosLeft[1]);
        ctx.closePath();
        ctx.stroke();
        this.drawHub(this.hubPosLeft, this.childrenCountLeft);
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(this.x + this.direction * this.width / 2, this.y);
      ctx.strokeStyle = this.lineColor;
      ctx.lineTo(this.hubPos[0], this.hubPos[1]);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      this.drawHub(this.hubPos, this.childrenCount);
    }
  },
  drawLine_to_parent: function drawLine_to_parent() {
    var ctx = this.qjm.ctx;
    ctx.save();
    ctx.beginPath();
    var moveToX = this.x - this.direction * this.width / 2;
    var moveToY = this.y;
    ctx.moveTo(moveToX, moveToY);
    ctx.strokeStyle = this.lineColor;

    if (this.parent.isRoot) {
      this.direction === 1 && ctx.quadraticCurveTo(moveToX - 50, moveToY, this.parent.hubPosRight[0], this.parent.hubPosRight[1]);
      this.direction === -1 && ctx.quadraticCurveTo(moveToX + 50, moveToY, this.parent.hubPosLeft[0], this.parent.hubPosLeft[1]);
    } else {
      ctx.quadraticCurveTo(this.direction === 1 ? moveToX - 50 : moveToX + 50, moveToY, this.parent.hubPos[0], this.parent.hubPos[1]);
    }

    ctx.stroke();
    ctx.restore();
  },
  drawHub: function drawHub(pos) {
    if (this.isRoot) {
      if (this.childrenCountRight) {
        this._drawHub(this.hubPosRight, this.childrenCountRight);

        this.set_mind_pos_map("hubPosRight", this);
      }

      if (this.childrenCountLeft) {
        this._drawHub(this.hubPosLeft, this.childrenCountLeft);

        this.set_mind_pos_map("hubPosLeft", this);
      }
    } else {
      if (this.childrenCount) {
        this._drawHub(this.hubPos, this.childrenCount);

        this.set_mind_pos_map("hubPos", this);
      }
    }
  },
  _drawHub: function _drawHub(pos, childLength) {
    var ctx = this.qjm.ctx;
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(31,35,41,0.08)";
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.hubRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (childLength > 0) {
      ctx.save();
      ctx.fillStyle = "#000000";
      ctx.font = "30px";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(childLength, pos[0], pos[1]);
      ctx.restore();
    }
  },
  getHubPos: function getHubPos() {
    if (this.isRoot) {
      this.hubPosLeft = [this.x + -1 * (this.width / 2 + 40), this.y];
      this.hubPosRight = [this.x + 1 * (this.width / 2 + 40), this.y];
    } else {
      this.hubPos = [this.x + this.direction * (this.width / 2 + 40), this.y];
    }
  },
  get_children_nodes: function get_children_nodes(dir) {
    return this.children.filter(function (item) {
      return item.direction === dir;
    });
  }
}; // ??????????????????

qjm.Mind = function (qjm, opts, nodeJson) {
  this.qjm = qjm;
  this.opts = opts;
  this.canvasCenter = null;
  this.nodeJson = [].concat(nodeJson);
  this.nodes = [];
  this.nodesFlatArray = [];
  this.totalHeight = 0;
  this.totalMaxNodeLength = 0;
  this.get_nodes();
  this.init();
};

qjm.Mind.prototype = {
  init: function init() {
    this.canvasCenter = this.qjm.getCanvasCenterPos();
    this.get_expanded_node_group();
    this.get_group_max_length();
    this.layout(); //?????????????????????xy?????????

    this.show_view();
  },
  get_nodes: function get_nodes() {
    for (var i = 0; i < this.nodeJson.length; i++) {
      this.nodes.push(this._parse(this.nodeJson[i]));
    }
  },
  _parse: function _parse(nodeJson, parentNode, parentNodeJson) {
    nodeJson.x = null;
    nodeJson.y = null;
    var node = this.add_node(nodeJson);
    node.parent = parentNode;

    if (nodeJson.children) {
      node.children = [];

      for (var index = 0; index < nodeJson.children.length; index++) {
        var childNodeJson = nodeJson.children[index];
        childNodeJson.childIndex = index;

        var child_node = this._parse(childNodeJson, node, nodeJson);

        node.children.push(child_node);
      }
    }

    return node;
  },
  add_node: function add_node(nodeJson) {
    var node = new qjm.KeyNode(this.qjm, nodeJson);
    node.id = qjm.util.newid();
    this.nodesFlatArray.push(node);
    return node;
  },
  show_view: function show_view() {
    for (var i = 0; i < this.nodes.length; i++) {
      this._draw_nodes(this.nodes[i]);

      this._draw_lines(this.nodes[i]); //TODO:???????????????

    }
  },
  _draw_nodes: function _draw_nodes(node) {
    if (node.parent && node.parent.isRoot) {
      if (node.direction === -1 && !node.parent.expandedLeft) return;
      if (node.direction === 1 && !node.parent.expandedRight) return;
    }

    if (node.parent && !node.parent.isRoot) {
      if (!node.parent.expanded) return;
    }

    node.show();

    if (node.children) {
      for (var index = 0; index < node.children.length; index++) {
        var child_node = node.children[index];

        this._draw_nodes(child_node);
      }
    }
  },
  _draw_lines: function _draw_lines(node) {
    if (node.parent && node.parent.isRoot) {
      if (node.direction === -1 && !node.parent.expandedLeft) return;
      if (node.direction === 1 && !node.parent.expandedRight) return;
    }

    if (node.parent && !node.parent.isRoot) {
      if (!node.parent.expanded) return;
    }

    if (node.parent) {
      node.drawLine_to_parent();
    }

    if (node.isRoot && (node.childrenCountLeft || node.childrenCountRight) || !node.isRoot && node.childrenCount) {
      node.drawLine_to_child();

      for (var index = 0; index < node.children.length; index++) {
        var child_node = node.children[index];

        this._draw_lines(child_node);
      }

      node.drawHub();
    }
  },
  get_expanded_node_group: function get_expanded_node_group() {
    var t = this;
    var group = [];

    for (var i = 0; i < t.nodes.length; i++) {
      var groupInfo = {
        group_index: i,
        expandedRankMaxLeft: 0,
        expandedRankMaxRight: 0,
        expandedNodesLeft: [],
        expandedNodesRight: []
      };
      groupInfo.expandedNodesLeft[0] = t.nodes[i];
      groupInfo.expandedNodesRight[0] = t.nodes[i];

      (function _rank(obj, rankid) {
        obj.rankIndex = rankid;
        groupInfo.expandedRankMaxRight = obj.direction === 1 && rankid > groupInfo.expandedRankMaxRight ? rankid : groupInfo.expandedRankMaxRight;
        groupInfo.expandedRankMaxLeft = obj.direction === -1 && rankid > groupInfo.expandedRankMaxLeft ? rankid : groupInfo.expandedRankMaxLeft; // ???????????????????????????????????????push?????????????????????????????????

        if (!groupInfo.expandedNodesLeft[rankid + 1]) groupInfo.expandedNodesLeft[rankid + 1] = [];
        if (!groupInfo.expandedNodesRight[rankid + 1]) groupInfo.expandedNodesRight[rankid + 1] = [];

        if (obj.children && obj.children.length && (obj.expanded || obj.expandedLeft || obj.expandedRight)) {
          var children_l = [],
              children_r = [];
          obj.children.forEach(function (item) {
            if (item.direction === -1) children_l.push(item);
            if (item.direction === 1) children_r.push(item);
          });
          children_l.length && groupInfo.expandedNodesLeft[rankid + 1].push(children_l);
          children_r.length && groupInfo.expandedNodesRight[rankid + 1].push(children_r);

          for (var j = 0; j < obj.children.length; j++) {
            _rank(obj.children[j], rankid + 1);
          }
        } else {
          // ???????????????????????????????????????????????????????????? ????????????
          if (obj.isRoot || !obj.isRoot && obj.direction === -1) groupInfo.expandedNodesLeft[rankid + 1].push({
            isEmpty: true,
            rankIndex: rankid + 1
          });
          if (obj.isRoot || !obj.isRoot && obj.direction === 1) groupInfo.expandedNodesRight[rankid + 1].push({
            isEmpty: true,
            rankIndex: rankid + 1
          });
        }
      })(t.nodes[i], 0);

      groupInfo.expandedNodesLeft = groupInfo.expandedNodesLeft.slice(0, groupInfo.expandedRankMaxLeft + 1);
      groupInfo.expandedNodesRight = groupInfo.expandedNodesRight.slice(0, groupInfo.expandedRankMaxRight + 1);
      t.nodes[i].groupInfo = groupInfo;
    }
  },
  // ???????????????????????????
  get_group_max_length: function get_group_max_length() {
    var t = this;

    for (var i = 0; i < t.nodes.length; i++) {
      var groupInfo = t.nodes[i].groupInfo; // ?????????????????????????????????????????????????????????????????????????????????

      var nodeLengthLeft = qjm.util.flatArray(groupInfo.expandedNodesLeft[groupInfo.expandedNodesLeft.length - 1]).length;
      var nodeLengthRight = qjm.util.flatArray(groupInfo.expandedNodesRight[groupInfo.expandedNodesRight.length - 1]).length;
      groupInfo.maxNodeLength = Math.max(nodeLengthLeft, nodeLengthRight);
      groupInfo.totalHeight = groupInfo.maxNodeLength * t.opts.keyNodeHeight + (length - 1) * 20;

      if (nodeLengthLeft >= nodeLengthRight) {
        groupInfo.maxSideDirection = -1;
      } else {
        groupInfo.maxSideDirection = 1;
      }
    }
  },
  _get_total_height: function _get_total_height() {
    var t = this;
    t.totalHeight = 0;

    for (var i = 0; i < t.nodes.length; i++) {
      t.totalMaxNodeLength += t.nodes[i].groupInfo.maxNodeLength;
      t.totalHeight += t.nodes[i].groupInfo.totalHeight;
    }

    var top = t.canvasCenter.y - t.totalHeight / 2;
    var bottom = t.canvasCenter.y + t.totalHeight / 2;

    for (var i = 0; i < t.nodes.length; i++) {
      var groupInfo = t.nodes[i].groupInfo;

      if (i > 0 && t.nodes[i - 1].groupInfo.top_y) {
        groupInfo.top_y = t.nodes[i - 1].groupInfo.top_y + t.nodes[i - 1].groupInfo.totalHeight + 100;
        groupInfo.centerPos = {
          x: this.canvasCenter.x,
          y: groupInfo.top_y + groupInfo.totalHeight / 2
        };
      } else {
        groupInfo.top_y = top;
        groupInfo.centerPos = {
          x: this.canvasCenter.x,
          y: groupInfo.top_y + groupInfo.totalHeight / 2
        };
      }
    }
  },
  layout: function layout() {
    var t = this;

    t._get_total_height();

    for (var i = 0; i < t.nodes.length; i++) {
      var group = t.nodes[i];
      var dir = group.groupInfo.maxSideDirection;
      var expandedNodesLeft = group.groupInfo.expandedNodesLeft;
      var expandedNodesRight = group.groupInfo.expandedNodesRight; // ???????????????????????????????????????????????????????????????????????????
      // ??????

      var rank_max_nodes_length_l = qjm.util.flatArray(expandedNodesLeft[expandedNodesLeft.length - 1]); // ??????

      var rank_max_nodes_length_r = qjm.util.flatArray(expandedNodesRight[expandedNodesRight.length - 1]);

      if (rank_max_nodes_length_l > rank_max_nodes_length_r) {
        t._layout_backward(expandedNodesLeft, -1, group.groupInfo.centerPos);

        t._layout_forward(expandedNodesRight, 1, group.groupInfo.centerPos);
      } else {
        t._layout_backward(expandedNodesRight, 1, group.groupInfo.centerPos);

        t._layout_forward(expandedNodesLeft, -1, group.groupInfo.centerPos);
      }
    }
  },
  // ??????????????????????????????????????????????????????
  _layout_backward: function _layout_backward(expandedNodes, dir, groupCenterPos) {
    // ??????
    var expandedRankMax = expandedNodes.length - 1;
    var rankMaxNodes = qjm.util.flatArray(expandedNodes[expandedRankMax]);
    var rankMaxNodesTotalHeight = rankMaxNodes.length * this.opts.keyNodeHeight + (rankMaxNodes.length - 1) * 20;
    var top_h = groupCenterPos.y - rankMaxNodesTotalHeight / 2 + this.opts.keyNodeHeight / 2;

    for (var i = 0; i < rankMaxNodes.length; i++) {
      rankMaxNodes[i].x = groupCenterPos.x + dir * expandedRankMax * (this.opts.keyNodeWidth + 110);
      rankMaxNodes[i].y = top_h + i * (this.opts.keyNodeHeight + 20);
    } // ??????????????????


    for (var i = expandedNodes.length - 2; i >= 0; i--) {
      var currRankNodes = expandedNodes[i]; //i?????????

      var nextRankNodes = expandedNodes[i + 1]; //??????????????????????????????

      var currRankNodesFlat = qjm.util.flatArray(currRankNodes);

      for (var j = 0; j < currRankNodesFlat.length; j++) {
        var node = currRankNodesFlat[j];
        node.x = groupCenterPos.x + dir * i * (this.opts.keyNodeWidth + 110);

        if (nextRankNodes[j] instanceof Object && nextRankNodes[j].isEmpty) {
          node.y = nextRankNodes[j].y;
        } else {
          var children = node.children.filter(function (item) {
            return item.direction === dir;
          });

          if (children.length) {
            node.y = (children[0].y + children[children.length - 1].y) / 2;
          }
        }
      }
    }
  },
  // ???????????????????????????????????????????????????
  _layout_forward: function _layout_forward(expandedNodes, dir, groupCenterPos) {
    var y0 = expandedNodes[0].y;

    this._layout_backward(expandedNodes, dir, groupCenterPos);

    var y1 = expandedNodes[0].y;
    var diff = y1 - y0;

    for (var i = 0; i < expandedNodes.length; i++) {
      var currRankNodes = expandedNodes[i]; //i?????????

      var currRankNodesFlat = qjm.util.flatArray(currRankNodes);

      for (var j = 0; j < currRankNodesFlat.length; j++) {
        var node = currRankNodesFlat[j];
        if (!node.isEmpty) node.y -= diff;
      }
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (qjm);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_mind__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/mind */ "./src/mind.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_src_mind__WEBPACK_IMPORTED_MODULE_0__.default);
})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=main.js.map