//---------------------------------------------------------------------
// uQRCode二维码生成插件 v4.0.6
// 
// uQRCode是一款基于Javascript环境开发的二维码生成插件，适用所有Javascript运行环境的前端应用和Node.js。
// 
// Copyright (c) Sansnn uQRCode All rights reserved.
// 
// Licensed under the Apache License, Version 2.0.
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// github地址：
//   https://github.com/Sansnn/uQRCode
// 
// npm地址：
//   https://www.npmjs.com/package/uqrcodejs
// 
// uni-app插件市场地址：
//   https://ext.dcloud.net.cn/plugin?id=1287
// 
// 复制使用请保留本段注释，感谢支持开源！
// 
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// 当前文件格式为 es，将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器（别名: esm，module）
// 如需在其他环境使用，请获取环境对应的格式文件
// 格式说明：
// amd - 异步模块定义，适用于 RequireJS 等模块加载器
// cjs - CommonJS，适用于 Node 环境和其他打包工具（别名：commonjs）
// es - 将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器（别名: esm，module）
// umd - 通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
//---------------------------------------------------------------------

function Plugin(UQRCode, options) {
  options.backgroundIs25D = true; // 背景为2.5d，默认为true

  options.draw25DCanvas = function(reserve) {
    let {
      isMaked,
      canvasContext: ctx,
      dynamicSize: size,
      backgroundIs25D,
      drawReserve
    } = this;

    if (!isMaked) {
      console.error('[uQRCode]: please execute the make method first!');
      return Promise.reject(new UQRCode.Error('please execute the make method first!'));
    }

    let drawModules = this.getDrawModules();

    let draw = async (resolve, reject) => {
      try {
        ctx.draw(reserve);

        for (var i = 0; i < drawModules.length; i++) {
          var drawModule = drawModules[i];
          ctx.save();

          switch (drawModule.type) {
            case 'area':
              /* 绘制区域 */
              if (backgroundIs25D) {
                var a = Math.sqrt(3) / 2;
                var b = 1 / 2;
                var c = -Math.sqrt(3) / 2;
                var d = 1 / 2;
                var o = a * 2;
                var e = size / 2;
                var f = (size - size / o) / 2;
                ctx.transform(a, b, c, d, e, f);
                ctx.setFillStyle(drawModule.color);
                ctx.fillRect(drawModule.x / o, drawModule.y / o, drawModule.width / o, drawModule.height / o);
              } else {
                ctx.setFillStyle(drawModule.color);
                ctx.fillRect(drawModule.x, drawModule.y, drawModule.width, drawModule.height);
              }
              break;
            case 'tile':
              /* 绘制小块 */
              var a = Math.sqrt(3) / 2;
              var b = 1 / 2;
              var c = -Math.sqrt(3) / 2;
              var d = 1 / 2;
              var o = a * 2;
              var e = size / 2;
              var f = (size - size / o) / 2;
              ctx.transform(a, b, c, d, e, f);

              var x = drawModule.x / o;
              var y = drawModule.y / o;
              var w = drawModule.width / o;
              var h = drawModule.height / o;
              ctx.setFillStyle(drawModule.color);
              ctx.fillRect(x, y, w, h);
              break;
            case 'image':
              /* 绘制图像 */
              if (drawModule.name === 'backgroundImage') {
                if (backgroundIs25D) {
                  var a = Math.sqrt(3) / 2;
                  var b = 1 / 2;
                  var c = -Math.sqrt(3) / 2;
                  var d = 1 / 2;
                  var o = a * 2;
                  var e = size / 2;
                  var f = (size - size / o) / 2;
                  ctx.transform(a, b, c, d, e, f);

                  var x = drawModule.x / o;
                  var y = drawModule.y / o;
                  var w = drawModule.width / o;
                  var h = drawModule.height / o;
                  var r = Math.round(drawModule.borderRadius);
                  if (w < 2 * r) {
                    r = w / 2;
                  }
                  if (h < 2 * r) {
                    r = h / 2;
                  }

                  /* 设置透明度 */
                  ctx.setGlobalAlpha(drawModule.alpha);

                  /* 绘制圆角 */
                  if (r > 0) {
                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.arcTo(x + w, y, x + w, y + h, r);
                    ctx.arcTo(x + w, y + h, x, y + h, r);
                    ctx.arcTo(x, y + h, x, y, r);
                    ctx.arcTo(x, y, x + w, y, r);
                    ctx.closePath();
                    ctx.setStrokeStyle('rgba(0,0,0,0)');
                    ctx.stroke();
                    ctx.clip();
                  }

                  try {
                    var img = await this.loadImage(drawModule.imageSrc);
                    ctx.drawImage(img, x, y, w, h);
                  } catch (e) {
                    console.error(`[uQRCode]: ${drawModule.imageSource} invalid!`);
                    throw new UQRCode.Error(`${drawModule.imageSource} invalid!`);
                  }
                } else {
                  var x = drawModule.x;
                  var y = drawModule.y;
                  var w = drawModule.width;
                  var h = drawModule.height;
                  var r = Math.round(drawModule.borderRadius);
                  if (w < 2 * r) {
                    r = w / 2;
                  }
                  if (h < 2 * r) {
                    r = h / 2;
                  }

                  /* 设置透明度 */
                  ctx.setGlobalAlpha(drawModule.alpha);

                  /* 绘制圆角 */
                  if (r > 0) {
                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.arcTo(x + w, y, x + w, y + h, r);
                    ctx.arcTo(x + w, y + h, x, y + h, r);
                    ctx.arcTo(x, y + h, x, y, r);
                    ctx.arcTo(x, y, x + w, y, r);
                    ctx.closePath();
                    ctx.setStrokeStyle('rgba(0,0,0,0)');
                    ctx.stroke();
                    ctx.clip();
                  }

                  try {
                    var img = await this.loadImage(drawModule.imageSrc);
                    ctx.drawImage(img, drawModule.x, drawModule.y, drawModule.width, drawModule.height);
                  } catch (e) {
                    console.error(`[uQRCode]: ${drawModule.imageSource} invalid!`);
                    throw new UQRCode.Error(`${drawModule.imageSource} invalid!`);
                  }
                }
              } else if (drawModule.name === 'foregroundImage') {
                var a = Math.sqrt(3) / 2;
                var b = 1 / 2;
                var c = -Math.sqrt(3) / 2;
                var d = 1 / 2;
                var o = a * 2;
                var e = size / 2;
                var f = (size - size / o) / 2;
                ctx.transform(a, b, c, d, e, f);

                var x = drawModule.x / o;
                var y = drawModule.y / o;
                var w = drawModule.width / o;
                var h = drawModule.height / o;
                var p = drawModule.padding / o;
                var r = drawModule.borderRadius;
                if (w < 2 * r) {
                  r = w / 2;
                }
                if (h < 2 * r) {
                  r = h / 2;
                }
                var bx = (drawModule.x - drawModule.padding) / o;
                var by = (drawModule.y - drawModule.padding) / o;
                var bw = (drawModule.width + drawModule.padding * 2) / o;
                var bh = (drawModule.height + drawModule.padding * 2) / o;
                var br = (bw / w) * r;
                if (bw < 2 * br) {
                  br = bw / 2;
                }
                if (bh < 2 * br) {
                  br = bh / 2;
                }
                /* 安卓微信小程序带小数操作旧版Canvas会出问题，而且很多地方都有问题，尽量保持整数 */
                x = Math.round(x);
                y = Math.round(y);
                w = Math.round(w);
                h = Math.round(h);
                p = Math.round(p);
                r = Math.round(r);
                bx = Math.round(bx);
                by = Math.round(by);
                bw = Math.round(bw);
                bh = Math.round(bh);
                br = Math.round(br);

                /* 绘制阴影 */
                ctx.save();
                ctx.setShadow(drawModule.shadowOffsetX, drawModule.shadowOffsetY, drawModule.shadowBlur, drawModule.shadowColor);
                /* 阴影需要一个填充块作为载体 */
                if (br > 0) {
                  ctx.beginPath();
                  ctx.moveTo(bx + br, by);
                  ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
                  ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
                  ctx.arcTo(bx, by + bh, bx, by, br);
                  ctx.arcTo(bx, by, bx + bw, by, br);
                  ctx.closePath();
                  ctx.setFillStyle(drawModule.backgroundColor);
                  ctx.fill();
                } else {
                  ctx.setFillStyle(drawModule.backgroundColor);
                  ctx.fillRect(bx, by, bw, bh);
                }
                ctx.restore();

                /* 绘制Padding */
                ctx.save();
                if (br > 0) {
                  ctx.beginPath();
                  ctx.moveTo(bx + br, by);
                  ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
                  ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
                  ctx.arcTo(bx, by + bh, bx, by, br);
                  ctx.arcTo(bx, by, bx + bw, by, br);
                  ctx.closePath();
                  ctx.setFillStyle(p > 0 ? drawModule.backgroundColor : 'rgba(0,0,0,0)');
                  ctx.fill();
                } else {
                  ctx.setFillStyle(p > 0 ? drawModule.backgroundColor : 'rgba(0,0,0,0)');
                  ctx.fillRect(bx, by, bw, bh);
                }
                ctx.restore();

                /* 绘制圆角 */
                if (r > 0) {
                  ctx.beginPath();
                  ctx.moveTo(x + r, y);
                  ctx.arcTo(x + w, y, x + w, y + h, r);
                  ctx.arcTo(x + w, y + h, x, y + h, r);
                  ctx.arcTo(x, y + h, x, y, r);
                  ctx.arcTo(x, y, x + w, y, r);
                  ctx.closePath();
                  ctx.setStrokeStyle('rgba(0,0,0,0)');
                  ctx.stroke();
                  ctx.clip();
                }

                try {
                  var img = await this.loadImage(drawModule.imageSrc);
                  ctx.drawImage(img, x, y, w, h);
                } catch (e) {
                  console.error(`[uQRCode]: ${drawModule.imageSource} invalid!`);
                  throw new UQRCode.Error(`${drawModule.imageSource} invalid!`);
                }
              }
              break;
          }

          /* gcanvas需要每一阶段都draw一下，否则重绘有问题，例如uni-app nvue绘制图片会失败 */
          if (drawReserve) {
            ctx.draw(true);
          }

          ctx.restore();
        }

        ctx.draw(true);
        /* 某些平台的draw回调不一定会触发，故resolve不放在draw回调中 */
        setTimeout(resolve, 150);
      } catch (e) {
        reject(e);
      }
    };

    return new Promise((resolve, reject) => {
      /* 完成绘制 */
      draw(resolve, reject);
    });
  };
}

Plugin.Type = 'style'; // 如果需要组件可用此扩展，那么该属性必需
Plugin.Name = '25d'; // 如果需要组件可用此扩展，那么该属性必需
Plugin.DrawCanvas = 'draw25DCanvas'; // 如果需要组件可用此扩展，那么该属性必需
export{Plugin as default};