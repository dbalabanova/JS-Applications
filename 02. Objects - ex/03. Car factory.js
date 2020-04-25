function solve(input) {
  let engines = [
    { power: 90, volume: 1800 },
    { power: 120, volume: 2400 },
    { power: 200, volume: 3500 }
  ];

    function wheels(neededSize)  {
    debugger;
    if (parseInt(neededSize) % 2 === 0) {
      return --neededSize;
    }
    return parseInt(neededSize);
  };
  return {
    model: input.model,
    engine: engines.find(e=>input.power<=e.power),
    carriage: {
      type: input.carriage,
      color: input.color
    },
    wheels: 
      new Array(4).fill(wheels(input.wheelsize))
     
  };
}
console.log(
  solve({
    model: "VW Golf II",
    power: 90,
    color: "blue",
    carriage: "hatchback",
    wheelsize: 14
  })
);
console.log(solve({ model: 'Opel Vectra',
power: 110,
color: 'grey',
carriage: 'coupe',
wheelsize: 17 }
));

