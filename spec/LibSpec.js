const lib = require('../main/lib');

describe("Lib", function(){
  it("calculates score correctly (1st result)", function() {
    expect(lib.calculateScore(0, 100, 10, 0)).toEqual(100);
    expect(lib.calculateScore(10, 90, 8, 0)).toEqual(90);
    expect(lib.calculateScore(20, 80, 7, 0)).toEqual(80);
    expect(lib.calculateScore(30, 60, 4, 0)).toEqual(60);
    expect(lib.calculateScore(40, 50, 1, 0)).toEqual(50);
    expect(lib.calculateScore(45, 45, 1, 0)).toEqual(45);
  });

  it("calculates score correctly", function() {
    expect(lib.calculateScore(0, 100, 10, 1)).toEqual(90);
    expect(lib.calculateScore(10, 90, 8, 2)).toEqual(70);
    expect(lib.calculateScore(20, 80, 7, 5)).toEqual(37);
    expect(lib.calculateScore(30, 60, 4, 3)).toEqual(37);
    expect(lib.calculateScore(40, 50, 6, 3)).toEqual(45);
    expect(lib.calculateScore(45, 45, 2, 1)).toEqual(45);
  });

  it("calculates score correctly (wrong answer)", function() {
    expect(lib.calculateScore(0, 100, 10, 10)).toEqual(0);
    expect(lib.calculateScore(10, 90, 8, 8)).toEqual(10);
    expect(lib.calculateScore(20, 80, 7, 7)).toEqual(20);
    expect(lib.calculateScore(30, 60, 4, 5)).toEqual(30);
    expect(lib.calculateScore(40, 50, 6, 8)).toEqual(40);
    expect(lib.calculateScore(45, 45, 2, 2)).toEqual(45);
  });

  it("calculates score correctly (again)", function() {
    expect(lib.calculateScore(99, 100, 10, 11)).toEqual(99);
    expect(lib.calculateScore(99, 100, 10, 10)).toEqual(99);
    expect(lib.calculateScore(99, 100, 10, 1)).toEqual(99);
    expect(lib.calculateScore(99, 100, 10, 0)).toEqual(100);
    expect(lib.calculateScore(10, 90, 7, 6)).toEqual(21);
    expect(lib.calculateScore(10, 90, 7, 7)).toEqual(10);
    expect(lib.calculateScore(10, 90, 7, 8)).toEqual(10);
  });

  it("throws errors when calculating score (with incorrect parameters)", function() {
    expect(function(){ lib.calculateScore(100, 99, 0, 11); }).toThrowError(RangeError);
    expect(function(){ lib.calculateScore(99, 100, -1, 11); }).toThrowError(RangeError);
    expect(function(){ lib.calculateScore(99, 100, 0, 11); }).toThrowError(RangeError);
    expect(function(){ lib.calculateScore(99, 100, 0, -1); }).toThrowError(RangeError);
    expect(function(){ lib.calculateScore(99, 100, 0, 0); }).toThrowError(RangeError);
  });
});
