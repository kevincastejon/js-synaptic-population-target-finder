export default class Checkpoint {
  constructor(type) {
    this.type = type;
  }

  static getTL() {
    return new Checkpoint(Checkpoint.TL);
  }

  static getTR() {
    return new Checkpoint(Checkpoint.TR);
  }

  static getBL() {
    return new Checkpoint(Checkpoint.BL);
  }

  static getBR() {
    return new Checkpoint(Checkpoint.BR);
  }

  getPatternOrientation(checkPoint) {
    let orientation = null;
    if (this.type === Checkpoint.TL) {
      if (checkPoint.type === Checkpoint.TR) {
        orientation = 0;
      } else if (checkPoint.type === Checkpoint.BL) {
        orientation = 1;
      }
    }
    if (this.type === Checkpoint.TR) {
      if (checkPoint.type === Checkpoint.BR) {
        orientation = 0;
      } else if (checkPoint.type === Checkpoint.TL) {
        orientation = 1;
      }
    }
    if (this.type === Checkpoint.BL) {
      if (checkPoint.type === Checkpoint.TL) {
        orientation = 0;
      } else if (checkPoint.type === Checkpoint.BR) {
        orientation = 1;
      }
    }
    if (this.type === Checkpoint.BR) {
      if (checkPoint.type === Checkpoint.BL) {
        orientation = 0;
      } else if (checkPoint.type === Checkpoint.TR) {
        orientation = 1;
      }
    }
    return orientation;
  }
}
Checkpoint.TL = 'topLeft';
Checkpoint.TR = 'topRight';
Checkpoint.BL = 'bottomLeft';
Checkpoint.BR = 'bottomRight';
