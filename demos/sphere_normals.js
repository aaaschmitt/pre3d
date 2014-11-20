// (c) Dean McNamee <dean@gmail.com>.  All rights reserved.

function start3d() {
  var screen_canvas = document.getElementById('canvas');
  var renderer = new Pre3d.Renderer(screen_canvas);

  var sphere = Pre3d.ShapeUtils.makeSphere(1, 3, 4);
  renderer.fill_rgba = new Pre3d.RGBA(0x78 / 255, 0xff / 255, 0, 1);

  // Do an extrusion so we can some interesting non-planar quads.
  var extruder = new Pre3d.ShapeUtils.Extruder();
  extruder.selectCustom(function(shape, quad_index) {
    return (quad_index == 0);
  });
  extruder.set_count(10);
  extruder.set_distance(3);
  extruder.rotate.x = extruder.rotate.y = 0.9;
  extruder.extrude(sphere);

  // Paint normal lines.
  renderer.normal1_rgba = new Pre3d.RGBA(1, 0, 0, 1);
  renderer.normal2_rgba = new Pre3d.RGBA(0, 1, 0, 1);

  var state = {
    sphere_rotate_y_rad: 0,
    sphere_rotate_x_rad: 0,
    sphere_x: 2,
    sphere_y: 0
  };

  // function draw() {
  //   renderer.transform.reset();
  //   renderer.transform.rotateX(state.sphere_rotate_x_rad);
  //   renderer.transform.rotateY(state.sphere_rotate_y_rad);
  //   renderer.transform.translate(state.sphere_x, state.sphere_y, -4);
  //   renderer.bufferShape(sphere);

  //   // White background.
  //   renderer.ctx.setFillColor(1, 1, 1, 1);
  //   renderer.drawBackground();

  //   renderer.drawBuffer();
  //   renderer.emptyBuffer();
  // }

  var circle = Pre3d.PathUtils.makeCircle();

  renderer.ctx.setStrokeColor(0x52 / 255, 0xbb / 255, 0x5c / 255, 1);
  renderer.ctx.lineWidth = 2;

  function draw() {
    // White background.
    renderer.ctx.setFillColor(1, 1, 1, 1);
    renderer.drawBackground();

    renderer.transform.reset();
    renderer.transform.translate(-0.5, 0, 0);  // Center over the origin.

    var side_line = Pre3d.PathUtils.makeLine({x: 0, y: 0, z: -0.5},
                                             {x: 0, y: 0, z: -5});
    renderer.pushTransform();
    for (var i = 0, il = 8; i < il; ++i) {
      renderer.transform.rotateZ(1/il * Math.PI * 2);
      renderer.drawPath(side_line);
    }
    renderer.popTransform();

    for (var i = 0; i < 10; ++i) {
      renderer.transform.translate(0, 0, -0.5);
      renderer.drawPath(circle);
    }
  }

  renderer.camera.focal_length = 2.5;
  DemoUtils.autoCamera(renderer, 0, 0, -8, 0, 0, 0, draw);

  function spin_and_draw() {
    state.sphere_rotate_y_rad += 0.1;
    state.sphere_rotate_x_rad += 0.01;
    state.sphere_x = Math.sin(state.sphere_rotate_y_rad / 2) * 3;
    state.sphere_y = Math.sin(state.sphere_rotate_x_rad * 4) * 3;
    draw();
  };

  var ticker = new DemoUtils.Ticker(30, spin_and_draw);

  var toolbar = new DemoUtils.ToggleToolbar();
  toolbar.addEntry('Go!', true, function(e) {
    if (this.checked) {
      ticker.start();
    } else {
      ticker.stop();
    }
  });
  toolbar.populateDiv(document.getElementById('toolbar'));

  ticker.start();
}

window.addEventListener('load', start3d(), false);
