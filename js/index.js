"use strict";

const testData = [
  {
    name: 'Front End',
    level: 8.5,
    levels: [
      {
        name: 'JavaScript',
        level: 8.5,
        color: '#ff0000'
      },
      {
        name: 'HTML',
        level: 8.5,
        color: '#00ff00'
      },
      {
        name: 'CSS',
        level: 8.5,
        color: '#0000ff'
      }
    ],
    color: '#00ff00'
  },
  {
    name: 'Mobile',
    level: 5,
    levels: [
      {
        name: 'PhoneGap',
        level: 6,
        color: '#0000ff'
      },
      {
        name: 'Swift',
        level: 2.5,
        color: '#ff0000'
      }
    ],
    color: '#0000ff'
  },
  {
    name: 'Back End',
    level: 5,
    levels: [
      {
        name: 'PHP',
        level: 6,
        color: '#ff0000'
      },
      {
        name: 'Node.js',
        level: 3,
        color: '#00ff00'
      },
      {
        name: 'Ruby',
        level: 1.5,
        color: '#0000ff'
      },
      {
        name: 'Python',
        level: 1.5,
        color: '#ff00ff'
      }
    ],
    color: '#ff0000'
  },
  {
    name: 'Database',
    level: 4,
    levels: [
      {
        name: 'MySQL',
        level: 4,
        color: '#00ff00'
      },
      {
        name: 'MongoDB',
        level: 4,
        color: '#0000ff'
      }
    ],
    color: '#ff00ff'
  }
];

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

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

const width = 960;
const height = 450;
const radius = Math.min(width, height) / 2;

const pie = d3.layout.pie().sort(null).value(function(d) { return d.level; });

let defaultArc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4)
;

let textArc = d3.svg.arc()
  .innerRadius(radius * 1.10)
  .outerRadius(radius + 1.25)
;

let outerTextArc = d3.svg.arc()
  .innerRadius(radius * 1.25)
  .outerRadius(radius + 1.5)
;

let outerArc = d3.svg.arc()
  .innerRadius(radius * 0.85)
  .outerRadius(radius * 1.0)
;

let hoverArc = d3.svg.arc()
  .innerRadius(radius * 0.4)
  .outerRadius(radius * 0.85)
;

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const key = (d) => { return d.data.name; };

const color = d3.scale.ordinal()
  .domain(keysArray)
  .range(colorsArray)
;

setup(shuffle(testData), defaultArc);

function setup(data, arc) {
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
      if(!d3.select(this).classed('active')) {
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
          .attr('d', arc)
        ;

        d3.select(this)
          .transition().duration(300)
          .style('opacity', 1.00)
          .attr('d', hoverArc)
        ;
      }
    })
    .on('mouseout', function(d) {
      if(!d3.select(this).classed('active')) {
        d3.select(this)
          .transition().duration(300)
          .style('opacity', 0.65)
          .attr('d', arc)
        ;
      }
    })
    .on('click', function(d) {
      d3.selectAll('.slice-secondary').remove();
      d3.selectAll('.line-secondary').remove();
      d3.selectAll('.label-secondary').remove();

      d3.selectAll('.slice').classed('active', false);

      if(!d3.select(this).classed('active')) {
        const levels = d.data.levels;

        d3.select(this).classed('active', true);

        setupSecondary(levels, outerArc, d.startAngle, d.endAngle);
      }
    })
  ;

  slice
    .transition().duration(500)
    .attrTween('d', function(d) {
      this._current = this._current || d;

      const interp = d3.interpolate(this._current, d);

      this._current = interp(0);

      return (t) => {
        return arc(interp(t));
      };
    })
  ;

  slice.exit().remove();

  let text = svg
    .select(".labels")
      .selectAll("text")
            .data(pie(data), key)
  ;

  text.enter()
      .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return d.data.name;
        })
  ;

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween("transform", function(d) {
          this._current = this._current || d;

          const interpolate = d3.interpolate(this._current, d);

          this._current = interpolate(0);

          return (t) => {
            const d2 = interpolate(t);

            const pos = textArc.centroid(d2);

            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);

            return "translate("+ pos +")";
          };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;

            const interpolate = d3.interpolate(this._current, d);

            this._current = interpolate(0);

            return (t) => {
              const d2 = interpolate(t);

              return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
  ;

  text.exit().remove();

  var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), key);

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = textArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), textArc.centroid(d2), pos];
            };
        });

    polyline.exit().remove();
}

function setupSecondary(data, arc, start, end) {
  const thisPie = d3.layout.pie().sort(null).value(function(d) { return d.level; }).startAngle(start).endAngle(end);

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
      //reduce opacity of parent to 0.80
    })
    .on('mouseout', function(d) {
      //increase opacity of parent to 1.00
    })
  ;

  slice
    .transition().duration(500)
    .style('opacity', 1.00)
    .attrTween('d', function(d) {
      this._current = this._current || d;

      const interp = d3.interpolate(this._current, d);

      this._current = interp(0);

      return (t) => {
        return arc(interp(t));
      };
    })
  ;

  slice.exit().remove();

  let text = svg
    .select(".secondary-labels")
      .selectAll("text")
            .data(thisPie(data), key)
  ;

  text.enter()
      .append("text")
        .attr('class', 'label-secondary')
        .attr("dy", ".35em")
        .text(function(d) {
            return d.data.name;
        })
  ;

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween("transform", function(d) {
          this._current = this._current || d;

          const interpolate = d3.interpolate(this._current, d);

          this._current = interpolate(0);

          return (t) => {
            const d2 = interpolate(t);

            const pos = outerTextArc.centroid(d2);

            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);

            return "translate("+ pos +")";
          };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;

            const interpolate = d3.interpolate(this._current, d);

            this._current = interpolate(0);

            return (t) => {
              const d2 = interpolate(t);

              return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
  ;

  text.exit().remove();

  var polyline = svg.select(".secondary-lines").selectAll("polyline")
        .data(pie(data), key);

    polyline.enter()
      .append("polyline")
      .attr('class', 'line-secondary')
    ;

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerTextArc.centroid(d2);
                pos[0] = radius * 1.75 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerTextArc.centroid(d2), pos];
            };
        });

    polyline.exit().remove();
}