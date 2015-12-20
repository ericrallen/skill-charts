"use strict";

/*
COLORS

borrowed from:  http://www.mulinblog.com/a-color-palette-optimized-for-data-visualization/

4D4D4D (gray)
5DA5DA (blue)
FAA43A (orange)
60BD68 (green)
F17CB0 (pink)
B2912F (brown)
B276B2 (purple)
DECF3F (yellow)
F15854 (red)
*/

import d3 from 'd3';

import testData from './data.js';

function testArcDepth(level, hover = false, outer = false) {
  const beginnerArray = [0, 0.5, 1, 1.5,  2];
  const intermediateArray = [2.5, 3, 3.5, 4, 4.5];
  const advancedArray = [5, 5.5, 6, 6.5, 7, 7.5];
  const expertArray = [8, 8.5, 9, 9.5, 10];

  if(beginnerArray.indexOf(level)  !== -1) {
    return (outer ? beginnerOuterArc : (hover ? beginnerHoverArc : beginnerArc));
  }

  if(intermediateArray.indexOf(level)  !== -1) {
    return (outer ? intermediateOuterArc : (hover ? intermediateHoverArc : intermediateArc));
  }

  if(advancedArray.indexOf(level)  !== -1) {
    return (outer ? advancedOuterArc : (hover ? advancedHoverArc : advancedArc));
  }

  if(expertArray.indexOf(level)  !== -1) {
    return (outer ? expertOuterArc : (hover ? expertHoverArc : expertArc));
  }
}

let hoverTimeoutMethod;
let hoverTimeout = 3000;

let hoverDelayMethod;
let hoverDelay = 150;

let keysArray = [];
let colorsArray = [];

buildArrays(testData);

function buildArrays(data) {
  data.forEach( (item) => {
    keysArray.push(item.name);
    colorsArray.push(item.color);
    if(item.levels) {
      buildArrays(item.levels);
    }
  });
}

function buildKey(data, inject) {
  data.forEach( (item, index, array) => {

    let legendSVG = inject.append('g')
      .attr('class', item.name)
    ;

    legendSVG
      .append('rect')
        .attr('x', 0)
        .attr('y', index * 30)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', item.color)
    ;

    legendSVG
      .append('text')
        .attr('x', 30)
        .attr('y', index * 30 + 7)
        .attr('class', 'label-legend')
        .attr("dy", "0.5em")
        .text(item.name)
    ;
  });
}

const legend = d3.select('#legend')
  .append('svg')
    .append('g')
      .attr('class', 'viz legend')
;

const svg = d3.select('#container')
  .append('svg')
    .append('g')
      .attr('class', 'viz')
;

svg.append('g')
  .attr('class', 'slices')
;

svg.append('g')
  .attr('class', 'labels')
;

svg.append('g')
    .attr('class', 'lines')
;

svg.append('g')
  .attr('class', 'secondary')
;

svg.append('g')
  .attr('class', 'secondary-labels')
;

svg.append('g')
  .attr('class', 'secondary-lines')
;

const containerElement = document.getElementById('container');
const legendElement = document.getElementById('legend');

const radius = containerElement.offsetWidth / 4;

const pie = d3.layout.pie().sort(null).value(function(d) { return d.level; });

let beginnerArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.35)
;

let intermediateArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.45)
;

let advancedArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.55)
;

let expertArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.65)
;

let beginnerHoverArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.65)
;

let intermediateHoverArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.75)
;

let advancedHoverArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.85)
;

let expertHoverArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.95)
;

let beginnerOuterArc = d3.svg.arc()
  .innerRadius(radius * 0.45)
  .outerRadius(radius * 0.65)
;

let intermediateOuterArc = d3.svg.arc()
  .innerRadius(radius * 0.55)
  .outerRadius(radius * 0.75)
;

let advancedOuterArc = d3.svg.arc()
  .innerRadius(radius * 0.65)
  .outerRadius(radius * 0.85)
;

let expertOuterArc = d3.svg.arc()
  .innerRadius(radius * 0.75)
  .outerRadius(radius * 0.95)
;

let defaultArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.65)
;

let hoverArc = d3.svg.arc()
  .innerRadius(radius * 0.25)
  .outerRadius(radius * 0.95)
;

let outerArc = d3.svg.arc()
  .innerRadius(radius * 0.75)
  .outerRadius(radius * 0.95)
;

let textArc = d3.svg.arc()
  .innerRadius(radius * 0.95)
  .outerRadius(radius * 1.15)
;

svg.attr("transform", "translate(" + containerElement.offsetWidth / 2 + "," + containerElement.offsetHeight / 2 + ")");

legend.attr("transform", "translate(" + legendElement.offsetWidth / 3 + "," + legendElement.offsetHeight / 2.75  + ")");

const key = (d) => { return d.data.name; };

const color = d3.scale.ordinal()
  .domain(keysArray)
  .range(colorsArray)
;

setup(testData);

buildKey(testData, legend);

function setup(data) {
  let slice = svg
    .select('.slices')
      .selectAll('path.slice')
        .data(pie(data), key)
  ;

  slice.enter()
    .insert('path')
    .style('fill', function(d) { return color(d.data.name); })
    .style('cursor', 'pointer')
    .attr('class', 'slice')
    .style('opacity', 0.65)
    .on('mouseenter', function(d) {
      let thisArc = testArcDepth(d.data.level);
      let thisHoverArc = testArcDepth(d.data.level, true);
      let thisOuterArc = testArcDepth(d.data.level, false, true);

      clearTimeout(hoverTimeoutMethod);

      clearTimeout(hoverDelayMethod);

      if(!d3.select(this).classed('active')) {
        hoverDelayMethod = setTimeout( () => {
          d3.select('.lines')
            .transition().duration(150)
            .style('opacity', '0.00')
          ;

          d3.select('.labels')
            .transition().duration(150)
            .style('opacity', '0.00')
          ;

          d3.selectAll('.line-secondary')
            .transition().duration(250)
            .style('opacity', 0.00)
            .remove()
          ;

          d3.selectAll('.label-secondary')
            .transition().duration(250)
            .style('opacity', 0.00)
            .remove()
          ;

          d3.selectAll('.slice-secondary')
            .transition().duration(500)
            .style('opacity', 0.00)
            .remove()
          ;

          d3.selectAll('.slice')
            .classed('active', false)
            .transition().duration(300)
            .style('opacity', 0.65)
            .attrTween('d', function(d) {
              this._current = this._current || d;

              const interpolate = d3.interpolate(this._current, d);

              this._current = interpolate(0);

              let arc = testArcDepth(d.data.level);

              return (t) => {
                return arc(interpolate(t));
              };
            })
          ;

          d3.select(this)
            .classed('active', true)
            .transition().duration(300)
            .style('opacity', 1.00)
            .attr('d', thisHoverArc)
          ;

          const levels = d.data.levels;

          setupSecondary(levels, thisOuterArc, d.startAngle, d.endAngle);
        }, hoverDelay);

        d3.select(this)
          .transition().duration(300)
          .style('opacity', 1.00)
        ;
      }
    })
    .on('mouseout', function(d) {
      clearTimeout(hoverDelayMethod);

      let thisArc = testArcDepth(d.data.level);
      let thisHoverArc = testArcDepth(d.data.level, true);
      let thisOuterArc = testArcDepth(d.data.level, false, true);

      if(!d3.select(this).classed('active')) {
        d3.select(this)
          .transition().duration(300)
          .style('opacity', 0.65)
          .attr('d', thisArc)
        ;
      } else {
        hoverTimeoutMethod = setTimeout( () => {
          d3.select('.lines')
            .transition().duration(150)
            .style('opacity', '1.00')
          ;

          d3.select('.labels')
            .transition().duration(150)
            .style('opacity', '1.00')
          ;

          d3.selectAll('.line-secondary')
            .transition().duration(250)
            .style('opacity', 0.00)
            .remove()
          ;

          d3.selectAll('.label-secondary')
            .transition().duration(250)
            .style('opacity', 0.00)
            .remove()
          ;

          d3.selectAll('.slice-secondary')
            .transition().duration(500)
            .style('opacity', 0.00)
            .remove()
          ;

          d3.selectAll('.slice')
            .classed('active', false)
            .transition().duration(300)
            .style('opacity', 0.65)
            .attrTween('d', function(d) {
              this._current = this._current || d;

              const interpolate = d3.interpolate(this._current, d);

              this._current = interpolate(0);

              let arc = testArcDepth(d.data.level);

              return (t) => {
                return arc(interpolate(t));
              };
            })
          ;
        }, hoverTimeout);
      }
    })
    .on('click', function(d) {
      clearTimeout(hoverTimeoutMethod);

      if(d3.select(this).classed('active')) {
        d3.select('.lines')
          .transition().duration(150)
          .style('opacity', '1.00')
        ;

        d3.select('.labels')
          .transition().duration(150)
          .style('opacity', '1.00')
        ;

        d3.selectAll('.line-secondary')
          .transition().duration(250)
          .style('opacity', 0.00)
          .remove()
        ;

        d3.selectAll('.label-secondary')
          .transition().duration(250)
          .style('opacity', 0.00)
          .remove()
        ;

        d3.selectAll('.slice-secondary')
          .transition().duration(500)
          .style('opacity', 0.00)
          .remove()
        ;

        d3.selectAll('.slice')
          .classed('active', false)
          .transition().duration(300)
          .attrTween('d', function(d) {
              this._current = this._current || d;

              const interpolate = d3.interpolate(this._current, d);

              this._current = interpolate(0);

              let arc = testArcDepth(d.data.level);

              return (t) => {
                return arc(interpolate(t));
              };
            })
        ;
      } else {
        clearTimeout(hoverTimeoutMethod);

        clearTimeout(hoverDelayMethod);

        let thisArc = testArcDepth(d.data.level);
        let thisHoverArc = testArcDepth(d.data.level, true);
        let thisOuterArc = testArcDepth(d.data.level, false, true);

        d3.select('.lines')
          .transition().duration(150)
          .style('opacity', '0.00')
        ;

        d3.select('.labels')
          .transition().duration(150)
          .style('opacity', '0.00')
        ;

        d3.selectAll('.line-secondary')
          .transition().duration(250)
          .style('opacity', 0.00)
          .remove()
        ;

        d3.selectAll('.label-secondary')
          .transition().duration(250)
          .style('opacity', 0.00)
          .remove()
        ;

        d3.selectAll('.slice-secondary')
          .transition().duration(500)
          .style('opacity', 0.00)
          .remove()
        ;

        d3.selectAll('.slice')
          .classed('active', false)
          .transition().duration(300)
          .style('opacity', 0.65)
          .attrTween('d', function(d) {
              this._current = this._current || d;

              const interpolate = d3.interpolate(this._current, d);

              this._current = interpolate(0);

              let arc = testArcDepth(d.data.level);

              return (t) => {
                return arc(interpolate(t));
              };
            })
        ;

        d3.select(this)
          .classed('active', true)
          .transition().duration(300)
          .style('opacity', 1.00)
          .attr('d', thisHoverArc)
        ;

        const levels = d.data.levels;

        setupSecondary(levels, thisOuterArc, d.startAngle, d.endAngle);
      }
    })
  ;

  slice
    .transition().duration(500)
    .attrTween('d', function(d) {
      this._current = this._current || d;

      const interpolate = d3.interpolate(this._current, d);

      this._current = interpolate(0);

      let arc = testArcDepth(d.data.level);

      return (t) => {
        return arc(interpolate(t));
      };
    })
  ;

  slice.exit().remove();

  function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  let text = svg
    .select('.labels')
      .selectAll('text')
        .data(pie(data), key)
  ;

  text.enter()
    .append('text')
      .attr('class', 'label')
      .attr('dy', '0.35em')
      .text(function(d) {
        return d.data.name;
      })
  ;

  text
    .transition().duration(200)
      .attrTween('transform', function(d) {
        this._current = this._current || d;

        const interpolate = d3.interpolate(this._current, d);

        let outerArc = testArcDepth(d.data.level, false, true);

        this._current = interpolate(0);

        return (t) => {
          const d2 = interpolate(t);

          let pos = outerArc.centroid(d2);

          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);

          return "translate(" + pos + ")";
        };
      })
      .styleTween("text-anchor", function(d){
            this._current = this._current || d;

            const interpolate = d3.interpolate(this._current, d);

            this._current = interpolate(0);

            return (t) => {
              const d2 = interpolate(t);

              return midAngle(d2) < Math.PI ? "start" : "end";
            };
        })
  ;

  text.exit().remove();

  var polyline = svg
    .select(".lines")
      .selectAll("polyline")
        .data(pie(data), key)
  ;

  polyline.enter()
    .append("polyline")
    .attr('class', 'line')
  ;

  polyline
    .transition().duration(1000)
      .attrTween("points", function(d) {
        this._current = this._current || d;

        const interpolate = d3.interpolate(this._current, d);

        this._current = interpolate(0);

        let arc = testArcDepth(d.data.level);

        let outerArc = testArcDepth(d.data.level, false, true);

        return function(t) {
          let d2 = interpolate(t);

          let pos = outerArc.centroid(d2);

          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);

          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
    })
  ;

  polyline.exit().remove();
}

function setupSecondary(data, arc, start, end) {
  const thisPie = d3.layout.pie().sort(null).value(function(d) { return d.level; }).startAngle(start).endAngle(end);

  textArc.startAngle(start).endAngle(end);

  let slice = svg
    .select('.secondary')
      .selectAll('path.slice-secondary')
        .data(thisPie(data), key)
  ;

  slice.enter()
    .insert('path')
    .style('opacity', 0.00)
    .style('fill', function(d) { return color(d.data.name); })
    .attr('class', 'slice-secondary')
    .on('mouseenter', function(d) {
    })
    .on('mouseout', function(d) {
    })
    .on('click', function(d) {
    })
  ;

  slice
    .transition().duration(500)
    .style('opacity', 1.00)
    .attrTween('d', function(d) {
      this._current = this._current || d;

      const interpolate = d3.interpolate(this._current, d);

      this._current = interpolate(0);

      return (t) => {
        return arc(interpolate(t));
      };
    })
  ;

  slice.exit().remove();

  function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  let text = svg
    .select('.secondary-labels')
      .selectAll('text')
        .data(thisPie(data), key)
  ;

  text.enter()
    .append('text')
      .attr('class', 'label-secondary')
      .attr('dy', '0.35em')
      .text(function(d) {
        return d.data.name;
      })
  ;

  text
    .transition().duration(200)
      .attrTween('transform', function(d) {
        this._current = this._current || d;

        const interpolate = d3.interpolate(this._current, d);

        this._current = interpolate(0);

        return (t) => {
          const d2 = interpolate(t);

          const newArc = textArc;

          newArc.startAngle(d2.startAngle).endAngle(d2.endAngle);

          let pos = newArc.centroid(d2);

          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);

          return "translate(" + pos + ")";
        };
      })
      .styleTween("text-anchor", function(d){
            this._current = this._current || d;

            const interpolate = d3.interpolate(this._current, d);

            this._current = interpolate(0);

            return (t) => {
              const d2 = interpolate(t);

              return midAngle(d2) < Math.PI ? "start" : "end";
            };
        })
  ;

  text.exit().remove();

  var polyline = svg
    .select(".secondary-lines")
      .selectAll("polyline")
        .data(thisPie(data), key)
  ;

  polyline.enter()
    .append("polyline")
    .attr('class', 'line-secondary')
  ;

  polyline
    .transition().duration(1000)
      .attrTween("points", function(d) {
        this._current = this._current || d;

        const interpolate = d3.interpolate(this._current, d);

        this._current = interpolate(0);

        return function(t) {
          let d2 = interpolate(t);

          const newArc = textArc;

          newArc.startAngle(d2.startAngle).endAngle(d2.endAngle);

          let pos = newArc.centroid(d2);

          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);

          return [arc.centroid(d2), textArc.centroid(d2), pos];
        };
    })
  ;

  polyline.exit().remove();
}
