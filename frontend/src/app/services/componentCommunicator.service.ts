import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentCommunicator {

  constructor() { }
  updatePanierEvent:EventEmitter<any>=new EventEmitter()
  emitEvent(){
    this.updatePanierEvent.emit("update")
  }
  updateNavbarEvent:EventEmitter<any>=new EventEmitter()
  emitUpdateNavbarEvent(){
this.updateNavbarEvent.emit("emit")
  }
}
