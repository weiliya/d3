import "../core/functor";
import "../core/zero";
import "../math/trigonometry";
import "svg";

d3.svg.arc = function() {
  var innerRadius = d3_svg_arcInnerRadius,
      outerRadius = d3_svg_arcOuterRadius,
      cornerRadius = d3_zero,
      startAngle = d3_svg_arcStartAngle,
      endAngle = d3_svg_arcEndAngle;

  function arc() {
    var r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        rc = +cornerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfπ,
        a1 = endAngle.apply(this, arguments) - halfπ,
        da = Math.abs(a1 - a0),
        df = da < π ? "0" : "1",
        fs = a1 < a0 ? "0" : "1",
        ss = a1 < a0 ? "1" : "0",
        c0 = Math.cos(a0),
        s0 = Math.sin(a0),
        c1 = Math.cos(a1),
        s1 = Math.sin(a1);

    if (rc) { // TODO support corners on inner arcs
      var ro = Math.sqrt((r1 - rc) * (r1 - rc) - rc * rc),
          i0 = d3_svg_arcCircleIntersect(r1, ro * c0 - rc * s0, rc * c0 + ro * s0, rc),
          i1 = d3_svg_arcCircleIntersect(r1, rc * s1 + ro * c1, ro * s1 - rc * c1, rc),
          ai0 = Math.atan2(i0[1], i0[0]),
          ai1 = Math.atan2(i1[1], i1[0]);
      if (ai1 < ai0 ^ a1 < a0) ai1 += τ; // TODO this isn’t quite right?
      df = Math.abs(ai1 - ai0) < π ? "0" : "1"; // correct sweep flag for shorter angle
      return "M" + (r1 * c0 - rc * c0) + "," + (r1 * s0 - rc * s0)
          + "A" + rc + "," + rc + " 0 0," + fs + " " + i0
          + "A" + r1 + "," + r1 + " 0 " + df + "," + fs + " " + i1
          + "A" + rc + "," + rc + " 0 0," + fs + " " + (r1 * c1 - rc * c1) + "," + (r1 * s1 - rc * s1)
          + "L0,0Z";
    }

    return da >= τε
      ? (r0
      ? "M0," + r1
      + "A" + r1 + "," + r1 + " 0 1," + fs + " 0," + -r1
      + "A" + r1 + "," + r1 + " 0 1," + fs + " 0," + r1
      + "M0," + r0
      + "A" + r0 + "," + r0 + " 0 1," + ss + " 0," + -r0
      + "A" + r0 + "," + r0 + " 0 1," + ss + " 0," + r0
      + "Z"
      : "M0," + r1
      + "A" + r1 + "," + r1 + " 0 1," + fs + " 0," + -r1
      + "A" + r1 + "," + r1 + " 0 1," + fs + " 0," + r1
      + "Z")
      : (r0
      ? "M" + r1 * c0 + "," + r1 * s0
      + "A" + r1 + "," + r1 + " 0 " + df + "," + fs + " " + r1 * c1 + "," + r1 * s1
      + "L" + r0 * c1 + "," + r0 * s1
      + "A" + r0 + "," + r0 + " 0 " + df + "," + ss + " " + r0 * c0 + "," + r0 * s0
      + "Z"
      : "M" + r1 * c0 + "," + r1 * s0
      + "A" + r1 + "," + r1 + " 0 " + df + "," + fs + " " + r1 * c1 + "," + r1 * s1
      + "L0,0Z");
  }

  arc.innerRadius = function(v) {
    if (!arguments.length) return innerRadius;
    innerRadius = d3_functor(v);
    return arc;
  };

  arc.outerRadius = function(v) {
    if (!arguments.length) return outerRadius;
    outerRadius = d3_functor(v);
    return arc;
  };

  arc.cornerRadius = function(v) {
    if (!arguments.length) return cornerRadius;
    cornerRadius = d3_functor(v);
    return arc;
  };

  arc.startAngle = function(v) {
    if (!arguments.length) return startAngle;
    startAngle = d3_functor(v);
    return arc;
  };

  arc.endAngle = function(v) {
    if (!arguments.length) return endAngle;
    endAngle = d3_functor(v);
    return arc;
  };

  arc.centroid = function() {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };

  return arc;
};

function d3_svg_arcInnerRadius(d) {
  return d.innerRadius;
}

function d3_svg_arcOuterRadius(d) {
  return d.outerRadius;
}

function d3_svg_arcStartAngle(d) {
  return d.startAngle;
}

function d3_svg_arcEndAngle(d) {
  return d.endAngle;
}

// Computes the intersection of two tangent circles.
// The first circle has radius r0 and center [0, 0]
// The second circle has radius r1 and center [x1, y1].
// Note: assumes the two circles are tangent!
function d3_svg_arcCircleIntersect(r0, x1, y1, r1) {
  var k = (r0 * r0 - r1 * r1) / (2 * (y1 * y1 + x1 * x1)) + .5;
  return [x1 * k, y1 * k];
}
