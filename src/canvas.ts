import Konva from 'konva';
import { Circle, CircleConfig } from 'konva/lib/shapes/Circle';
import { Rect, RectConfig } from 'konva/lib/shapes/Rect';
import { Text, TextConfig } from 'konva/lib/shapes/Text';
import { StageConfig } from 'konva/lib/Stage';

export type CanvasConfig = Pick<StageConfig, 'container' | 'width' | 'height'>;

export type TextParam = Pick<
  TextConfig,
  | 'x'
  | 'y'
  | 'text'
  | 'fontSize'
  | 'fontFamily'
  | 'fill'
  | 'width'
  | 'padding'
  | 'align'
>;

export type RectParam = Pick<
  RectConfig,
  'x' | 'y' | 'width' | 'height' | 'fill' | 'stroke' | 'strokeWidth'
>;

export type CircleParam = Pick<
  CircleConfig,
  'x' | 'y' | 'radius' | 'fill' | 'stroke' | 'strokeWidth'
>;

export interface Canvas {
  addText: (param: TextParam) => Text;
  addRectangle: (param: RectParam) => Rect;
  addCircle: (param: CircleParam) => Circle;
  addUiEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => void;
}

export const getCanvas = ({
  container = 'container',
  width,
  height,
}: CanvasConfig): Canvas => {
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
    }: TextParam) => {
      const textElement = new Konva.Text({
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
      layer.add(textElement);

      return textElement;
    },
    addRectangle: ({
      x,
      y,
      width,
      height,
      fill,
      stroke = 'black',
      strokeWidth = 1,
    }: RectParam) => {
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
    addCircle: ({
      x,
      y,
      radius,
      fill,
      stroke = 'black',
      strokeWidth = 1,
    }: CircleParam) => {
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
    addUiEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject
    ) => {
      var container = stage.container();
      container.tabIndex = 1;
      container.focus();
      container.addEventListener(type, listener);
    },
  };
};
