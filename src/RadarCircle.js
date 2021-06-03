// @flow
import React from 'react';
import _ from 'lodash';
import {radialLine, curveLinearClosed} from 'd3-shape';
import type {TickScale, RadarPoint} from './types';

type RadarCircleProps = {
  points: Array<RadarPoint>,
  scales: {[variableKey: string]: TickScale},
  offsetAngles: {[variableKey: string]: number},
  isSelected: boolean,
  selectedVariableKey: ?string,
  color: string,
  style?: {},
};

const defaultCircleStyle = {
  selectedFillOpacity: 0.5,
  inactiveFillOpacity: 0.0,
  selectedStrokeOpacity: 1.0,
  inactiveStrokeOpacity: 1.0,
  pointRadius: 3,
  selectedPointFill: 'white',
  selectedPointOpacity: 1.0,
  inactivePointOpacity: 1.0,
};

export default function RadarCircle(props: RadarCircleProps) {
  const {
    points,
    scales,
    offsetAngles,
    isSelected,
    color,
    selectedVariableKey,
    style,
  } = props;
  const {
    selectedFillOpacity,
    inactiveFillOpacity,
    selectedStrokeOpacity,
    inactiveStrokeOpacity,
    pointRadius,
    selectedPointFill,
    selectedPointOpacity,
    inactivePointOpacity,
  } = {...defaultCircleStyle, ...style};

  const lineFunction = radialLine()
    .radius((point: RadarPoint) => scales[point.variableKey](point.value))
    .angle((point: RadarPoint) => _.round(offsetAngles[point.variableKey], 6))
    .curve(curveLinearClosed);

  const pathData = lineFunction(points);
  return (
    <g>
      <path
        d={pathData}
        fill={color}
        fillOpacity={isSelected ? selectedFillOpacity : inactiveFillOpacity}
        stroke={color}
        strokeWidth={2}
        strokeOpacity={
          isSelected ? selectedStrokeOpacity : inactiveStrokeOpacity
        }
      />
      {points.map(point => {
        return (
          <circle
            key={point.key}
            r={pointRadius}
            fill={
              point.variableKey === selectedVariableKey
                ? selectedPointFill
                : color
            }
            stroke={color}
            cx={point.x}
            cy={point.y}
            opacity={isSelected ? selectedPointOpacity : inactivePointOpacity}
          />
        );
      })}
    </g>
  );
}
