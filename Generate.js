class Generate {
  sampleCount;
  percent;
  constructor(sampleCount, percent) {
    this.sampleCount = sampleCount;
    this.percent = percent;
  }
  stroop = (colors) => {
    let outSamples = [];
    let colorIndex = 0;
    let incCount = Math.floor(this.sampleCount * (this.percent / 100));

    const nextIndexColor = (colorI) => {
      colorI++;
      if (colorI >= colors.length) colorI = 0;
      return colorI;
    };
    const setIncong = (data) => {
      colorIndex = 0;
      for (let i = 0; i < incCount; i++) {
        data[i].type = "I";
        colorIndex = nextIndexColor(colorIndex);
        while (data[i].colorName === colors[colorIndex].color)
          colorIndex = nextIndexColor(colorIndex);
        data[i].colorCode = colors[colorIndex].codeColor;
        data[i].colorName = colors[colorIndex].color;
      }
      outSamples = data.sort(() => Math.random() - 0.5);
    };
    const setSample = () => {
      let outSampleTemp = [];
      for (let i = 0; i < this.sampleCount; i++) {
        if (colorIndex >= colors.length) {
          colorIndex = 1;
        } else {
          colorIndex = colorIndex + 1;
        }

        let tempObject = {
          type: "C",
          colorText: colors[colorIndex - 1].text,
          colorName: colors[colorIndex - 1].color,
          colorCode: colors[colorIndex - 1].codeColor,
        };
        outSampleTemp.push(tempObject);
      }
      outSamples = outSampleTemp.sort(() => Math.random() - 0.5);
      setIncong(outSamples);
    };

    setSample();

    return outSamples;
  };

  nback = (samples, nth,tryNumber) => {
    let cntTarget = 0;
    let sampleIndex = 0;
    let outSample = [];
    let target = Math.floor(this.sampleCount * (this.percent / 100));
    let distance = Math.ceil(this.sampleCount / target);


    const setSample = () => {
      let outSampleTemp = [];
      for (let i = 0; i < this.sampleCount; i++) {
        if (sampleIndex >= samples.length) {
          sampleIndex = 1;
        } else {
          sampleIndex = sampleIndex + 1;
        }

        let tempObject = { text: samples[sampleIndex - 1], targetSample: 0 };
        outSampleTemp.push(tempObject);
      }

      outSample = outSampleTemp.sort(() => Math.random() - 0.5);
      setTarget(outSample);
    };

    const setTarget = (data) => {
      sampleIndex = 0;
      for (let i = nth; i < this.sampleCount - distance; i += distance) {
        if (data[i] !== outSample[i + nth]) {
          data[i + nth].text = data[i].text;
          data[i + nth].targetSample = 1;
        }
      }
      check(data);

    };
    const countTarget = (outArray2) => {
      cntTarget = 0;
      for (let i = outArray2.length - 1; i >= nth; i--) {
        if (outArray2[i].text === outArray2[i - nth].text) {
          outArray2[i].targetSample = 1;
          cntTarget = cntTarget + 1;
        }
      }

      return cntTarget;
    };
    const check = (outArray) => {
      let t = countTarget(outArray);
      let ttryNumber=0;
      while (t !== target) {
        t = countTarget(outArray);
        if (t > target) {
          let res = t - target;
          let startPoint;
          if (res < 0) res = res * -1;
          while (res) {
            startPoint = 0;
            let temp;
            temp = deleteTarget(outArray, startPoint);
            outArray = [];
            outArray = temp;
            res = res - 1;
          }

        }
        if (t < target) {
          let res = target - t;
          let startPoint = 0;
          let startIndex=0;
         
          while (res) {
            let temp;

            if(ttryNumber>tryNumber)
            throw new Error("max try");

            if (startPoint === this.sampleCount - 1){
              startPoint = startIndex;
              startIndex++;
              if(startIndex>=this.sampleCount)
              startIndex=0;
            } 
            if (startPoint + nth < this.sampleCount) {
              temp = addTarget(outArray, startPoint);
              outArray = [];
              outArray = temp;
              res = res - 1;
              startPoint = startPoint + distance;
              ttryNumber++;
            }
          }

        }
      }
      outSample = outArray;
    };
    const deleteTarget = (outArray3, startPoint) => {
      for (let i = startPoint; i < this.sampleCount; i++) {
        if (outArray3[i].text === outArray3[i + nth].text) {
          outArray3[i + nth].targetSample = 0;
          if (i < nth) {
            if (nth > 1) outArray3[i].text = outArray3[i + 1].text;
            else {
              if (outArray3[i].text === 9) outArray3[i].text = 8;
              else if (outArray3[i].text === 1) outArray3[i].text = 2;
              else outArray3[i].text = outArray3[i].text + 1;
            }
          } else {
            let tempRes = outArray3[i - nth].text - outArray3[i].text;

            if (tempRes > 0) outArray3[i].text = tempRes;
            else if (tempRes === 0) {
              if (tempRes === 9) tempRes = 8;
              else if (tempRes === 1) tempRes = 2;
              outArray3[i].text = tempRes;
            } else outArray3[i].text = -1 * tempRes;
          }

          return outArray3;
        }
      }
    };
    const addTarget = (outArray4, startPoint) => {

      for (let i = startPoint; i < this.sampleCount - nth; i++) {
        if (outArray4[i].text !== outArray4[i + nth].text) {
          if (i + nth + nth <= this.sampleCount - 1) {
            if (outArray4[i + nth].text !== outArray4[i + nth + nth].text) {
              outArray4[i + nth].text = outArray4[i].text;
              outArray4[i + nth].targetSample = 1;
              return outArray4;
            }
          }
          else
          {
            outArray4[i + nth].text = outArray4[i].text;
            outArray4[i + nth].targetSample = 1;
            return outArray4;
          }
        }
      }
      return outArray4;
    };
    setSample();
    return outSample;
  };

  cpt = (samples, target) => {
    let outSamples = [];
    let targetIndex = 0;
    let incCount = Math.floor(this.sampleCount * (this.percent / 100));

    const nextTargetIndex = (targetI) => {
      targetI++;
      if (targetI >= target.length) targetI = 0;
      return targetI;
    };

    const setSample = () => {
      let outSampleTemp = [];
      for (let i = 0; i < this.sampleCount; i++) {
        if (targetIndex >= samples.length) {
          targetIndex = 1;
        } else {
          targetIndex = targetIndex + 1;
        }

        let tempObject = {
          imageIndex: samples[targetIndex - 1],
          targetSample: 0,
        };
        outSampleTemp.push(tempObject);
      }
      outSamples = outSampleTemp.sort(() => Math.random() - 0.5);
      setTarget(outSamples);
    };
    const setTarget = (data) => {
      targetIndex = 0;
      for (let i = 0; i < incCount; i++) {
        targetIndex = nextTargetIndex(targetIndex);
        data[i].imageIndex = target[targetIndex];
        data[i].targetSample = 1;
      }
      outSamples = data.sort(() => Math.random() - 0.5);
    };
    let intersectionArray = samples.filter((x) => target.includes(x));
    if (intersectionArray.length === 0) {
      setSample();
    } else throw new Error("samples and target have intersection!");
    return outSamples;
  };

  gonogo = (samples, target) => {
    let outSamples = [];
    let targetIndex = 0;
    let incCount = Math.floor(this.sampleCount * (this.percent / 100));

    const nextTargetIndex = (targetI) => {
      targetI++;
      if (targetI >= target.length) targetI = 0;
      return targetI;
    };
    const setSample = () => {
      let outSampleTemp = [];
      for (let i = 0; i < this.sampleCount; i++) {
        if (targetIndex >= samples.length) {
          targetIndex = 1;
        } else {
          targetIndex = targetIndex + 1;
        }

        let tempObject = { text: samples[targetIndex - 1], targetSample: 0 };
        outSampleTemp.push(tempObject);
      }
      outSamples = outSampleTemp.sort(() => Math.random() - 0.5);
      setTarget(outSamples);
    };

    const setTarget = (data) => {
      targetIndex = 0;
      for (let i = 0; i < incCount; i++) {
        targetIndex = nextTargetIndex(targetIndex);
        data[i].text = target[targetIndex];
        data[i].targetSample = 1;
      }
      outSamples = data.sort(() => Math.random() - 0.5);
    };

    let intersectionArray = samples.filter((x) => target.includes(x));
    if (intersectionArray.length === 0) {
      setSample();
    } else {
      throw new Error("samples and target have intersection!");
    }
    return outSamples;
  };
}

exports.Generate = Generate;
