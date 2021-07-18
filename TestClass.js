const Generate = require("./Generate.js");

const object = new Generate.Generate(100, 45);

object
  .cpt([0, 1], [2])
  .then((cptOut) => {
    console.log(cptOut);
  })
  .catch((err) => {
    console.log(err);
  });

object
  .gonogo(["ب", "ت", "ث"], ["پ"])
  .then((gonogoOut) => {
    console.log(gonogoOut);
  })
  .catch((err) => {
    console.log(err);
  });

object
  .stroop([
    { IC: "C", text: "قرمز", color: "red", codeColor: "#B10D0D" },
    { IC: "C", text: "زرد", color: "yellow", codeColor: "#F0E210" },
    { IC: "C", text: "سبز", color: "green", codeColor: "#4CA810" },
    { IC: "C", text: "آبی", color: "blue", codeColor: "#1042F0" },
  ])
  .then((stroopOut) => {
    console.log(stroopOut);
  })
  .catch((err) => {
    console.log(err);
  });

object
  .nback([1, 2, 3, 4, 5, 6, 7, 8, 9], 2, 40)
  .then((nbackOut) => {
    console.log(nbackOut);
  })
  .catch((err) => {
    console.log(err);
  });
