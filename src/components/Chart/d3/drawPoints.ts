import { ScaleLinear, select } from 'd3';
import { Point } from '../types';

type DrawPoints = (
  selection: ReturnType<typeof select>,
  data: {
    points: Point[];
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
  },
) => void;

export const drawPoints: DrawPoints = (
  selection,
  { points, xScale, yScale },
) => {
  const mouseover = (e: MouseEvent, d: Point) => {
    const getNumberWithOrdinal = (n: number): string => {
      return (
        n + (['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th')
      );
    };

    const tooltip = select(`#chart`)
      .append('div')
      .classed('tooltipPoint', true)
      .style('top', `${yScale(+d.price) - 17}px`)
      .style('left', `${xScale(+d.order) + 17}px`);
    tooltip
      .append('div')
      .classed('orderNumber', true)
      .text(`${getNumberWithOrdinal(Math.abs(d.order))} NFT`);

    const price = tooltip.append('div').classed('price', true);
    price
      .append('span')
      .classed('priceTitle', true)
      .text(`price: ${d.price.toFixed(1)} %`);
  };

  const pointsGroup = selection.append('g');

  pointsGroup
    .selectAll('myCircles')
    .data(points)
    .enter()
    .append('circle')
    .classed('point', true)
    .attr('cx', ({ order }) => xScale(order))
    .attr('cy', ({ price }) => yScale(price))
    .attr('r', 4)
    .style('cursor', 'pointer')
    .on('mouseover', mouseover)
    .on('mouseout', () => select('.tooltipPoint').remove());
};
