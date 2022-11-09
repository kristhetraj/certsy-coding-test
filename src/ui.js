var stage = new Konva.Stage({
  container: 'container', // id of container <div>
  width: 1000,
  height: 500,
});
var layer = new Konva.Layer();
stage.add(layer);

export const addText = ({
  x,
  y,
  text,
  fontSize = 18,
  fontFamily = 'Calibri',
  fill = 'black',
  width = 300,
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
};

export const addRectangle = ({
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
};

export const addCircle = ({
  x,
  y,
  radius,
  fill,
  stroke = 'black',
  strokeWidth = 1,
}) => {
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
};

layer.draw();

export const addUiEventListener = (event, listener) => {
  var container = stage.container();
  container.tabIndex = 1;
  container.focus();
  container.addEventListener(event, listener)
};
