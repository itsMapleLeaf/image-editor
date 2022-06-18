import { makeAutoObservable } from "mobx"

export class FrameState {
  width = 640
  height = 360

  constructor() {
    makeAutoObservable(this)
  }

  setWidth = (width: number) => {
    this.width = width
  }

  setHeight = (height: number) => {
    this.height = height
  }
}
