export const getCanvas = ({ container = 'container', width, height }) => {
  var stage = new Konva.Stage({
    container,
    width,
    height,
  });
  var layer = new Konva.Layer();
  stage.add(layer);
  layer.draw();

  return {
    addText: ({
      x,
      y,
      text,
      fontSize = 18,
      fontFamily = 'Calibri',
      fill = 'black',
      width = 350,
      padding = 20,
      align = 'center',
    }) => {
      var text = new Konva.Text({
        x,
        y,
        text,
        fontSize,
        fontFamily,
        fill,
        width,
        padding,
        align,
      });
      layer.add(text);

      return text;
    },
    addRectangle: ({
      x,
      y,
      width,
      height,
      fill,
      stroke = 'black',
      strokeWidth = 1,
    }) => {
      var rect = new Konva.Rect({
        x,
        y,
        width,
        height,
        fill,
        stroke,
        strokeWidth,
      });
      layer.add(rect);

      return rect;
    },
    addCircle: ({ x, y, radius, fill, stroke = 'black', strokeWidth = 1 }) => {
      var circle = new Konva.Circle({
        x,
        y,
        radius,
        fill,
        stroke,
        strokeWidth,
      });
      layer.add(circle);
      return circle;
    },
    addUiEventListener: (event, listener) => {
      var container = stage.container();
      container.tabIndex = 1;
      container.focus();
      container.addEventListener(event, listener);
    },
  };
};
