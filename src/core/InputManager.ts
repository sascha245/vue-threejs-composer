import * as THREE from "three";

const NAVIGATOR_FIREFOX =
  navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

export class InputManager {
  // creates arrays to store information about the state of
  // each of the keys. true if pressed, false otherwise. the
  // *previousKeyStates* array is used to store the state of
  // the keys during the previous update cycle.

  private keyStates: boolean[] = new Array(256);
  private previousKeyStates: boolean[] = new Array(256);
  private realKeyStates: boolean[] = new Array(256);

  // analogous to *keyStates* and *previousKeyStates*
  private mouseStates: boolean[] = new Array(3);
  private previousMouseStates: boolean[] = new Array(3);
  private realMouseStates: boolean[] = new Array(3);

  // mouse position
  public mousePosition = new THREE.Vector2(0, 0);
  public lastMousePosition = new THREE.Vector2(0, 0);
  private realMousePosition = new THREE.Vector2(0, 0);

  public mouseMoving = false;
  private realMouseMoving = false;

  constructor() {
    // initializes all the keyStates to their resting
    // position - not pressed
    for (let i = 0; i < this.keyStates.length; i++) {
      this.keyStates[i] = false;
      this.previousKeyStates[i] = false;
      this.realKeyStates[i] = false;
    }
    // same as *keyStates* initialization
    for (let i = 0; i < this.mouseStates.length; i++) {
      this.mouseStates[i] = false;
      this.previousMouseStates[i] = false;
      this.realMouseStates[i] = false;
    }

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    // console.log("keydown", e);
    if (e.which === 18) e.preventDefault();
    this.realKeyStates[e.which] = true;
  };
  private onKeyUp = (e: KeyboardEvent) => {
    // console.log("keyup", e);
    this.realKeyStates[e.which] = false;
  };
  private onMouseDown = (e: MouseEvent) => {
    // console.log("mousedown", e);
    this.realMouseStates[e.button] = true;
  };
  private onMouseUp = (e: MouseEvent) => {
    // console.log("mouseup", e);
    this.realMouseStates[e.button] = false;
  };
  private onMouseMove = (e: MouseEvent) => {
    // console.log("mousemove", e);
    this.realMousePosition.x = e.clientX;
    this.realMousePosition.y = e.clientY;
    this.realMouseMoving = true;
  };

  public dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  public isReleased(combo: string) {
    return (
      !this.checkCombo(combo, this.mouseStates, this.keyStates) &&
      this.checkCombo(combo, this.previousMouseStates, this.previousKeyStates)
    );
  }

  public isPressed(combo: string) {
    return (
      this.checkCombo(combo, this.mouseStates, this.keyStates) &&
      !this.checkCombo(combo, this.previousMouseStates, this.previousKeyStates)
    );
  }

  public isDown(combo: string) {
    return this.checkCombo(combo, this.mouseStates, this.keyStates);
  }

  // updates the key and mouse states of the current *pinput* instance.
  // the previous key and mouse states are set to the current ones, and
  // the current ones are set to reflect the actual state of the keyboard
  // and mouse.
  public update() {
    // set previous keyStates to current keyStates
    const tmpKeys = this.previousKeyStates;
    this.previousKeyStates = this.keyStates;
    this.keyStates = tmpKeys;

    // set previous mouseStates to current keyStates
    const tmpMouses = this.previousMouseStates;
    this.previousMouseStates = this.mouseStates;
    this.mouseStates = tmpMouses;

    // update mouse positions
    this.lastMousePosition.x = this.mousePosition.x;
    this.lastMousePosition.y = this.mousePosition.y;
    this.mousePosition.x = this.realMousePosition.x;
    this.mousePosition.y = this.realMousePosition.y;

    // update current keyStates
    for (let i = 0; i < this.keyStates.length; i++) {
      this.keyStates[i] = this.realKeyStates[i];
    }

    // update current mouseStates
    for (let i = 0; i < this.keyStates.length; i++) {
      this.mouseStates[i] = this.realMouseStates[i];
    }

    this.mouseMoving = this.realMouseMoving;
    this.realMouseMoving = false;
  }

  private checkCombo(
    combination: string,
    mouseStates: boolean[],
    keyStates: boolean[]
  ) {
    const combos = this.convertStringToCombo(combination);

    for (const combo of combos) {
      if (combo[0] === "mouse") {
        if (!mouseStates[combo[1]]) {
          return false;
        }
      } else {
        if (!keyStates[combo[1]]) {
          return false;
        }
      }
    }
    return true;
  }

  // converts a string to a keycode
  private convertStringToKeyCode(pKey: string): [string, number] | null {
    const key = this.removeWhiteSpace(pKey).toUpperCase();

    switch (key) {
      case "BACKSPACE":
        return ["key", 8];
      case "SPACEBAR":
        return ["key", 32];
      case "TAB":
        return ["key", 9];
      case "ENTER":
        return ["key", 13];
      case "SHIFT":
        return ["key", 16];
      case "CONTROL":
        return ["key", 17];
      case "ALT":
        return ["key", 18];
      case "CAPSLOCK":
        return ["key", 20];
      case "ESCAPE":
        return ["key", 27];
      case "PAGEUP":
        return ["key", 33];
      case "PAGEDOWN":
        return ["key", 34];
      case "ARROWLEFT":
        return ["key", 37];
      case "ARROWUP":
        return ["key", 38];
      case "ARROWRIGHT":
        return ["key", 39];
      case "ARROWDOWN":
        return ["key", 40];
      case "INSERT":
        return ["key", 45];
      case "DELETE":
        return ["key", 46];
      case "+":
        return ["key", NAVIGATOR_FIREFOX ? 61 : 187];
      case "=":
        return ["key", NAVIGATOR_FIREFOX ? 61 : 187];
      case "-":
        return ["key", NAVIGATOR_FIREFOX ? 173 : 189];
      case "[":
        return ["key", 219];
      case "]":
        return ["key", 221];
      case "/":
        return ["key", 191];
      case "\\":
        return ["key", 220];
      default:
        return ["key", key.charCodeAt(0)];
    }
  }

  // same as *convertStringToKeyCombo* but with mouse buttons
  private convertStringToButtonCode(
    buttonCode: string
  ): [string, number] | null {
    const code = this.removeWhiteSpace(buttonCode).toUpperCase();
    switch (code) {
      case "MOUSELEFT":
        return ["mouse", 0];
      case "MOUSEMIDDLE":
        return ["mouse", 1];
      case "MOUSERIGHT":
        return ["mouse", 2];
      default:
        return null;
    }
  }

  private convertStringToCombo(pCombo: string) {
    const combo = this.stripWhiteSpace(pCombo);
    const tokens = combo.split(" ");
    const keysAndButtons = [];

    for (const token of tokens) {
      const code = this.convertStringToButtonCode(token);

      if (code != null) {
        keysAndButtons.push(code);
      } else {
        const keyCode = this.convertStringToKeyCode(token);
        if (!keyCode) {
          throw new Error(
            `Invalid combo "${pCombo}" specified: "${token}" not found`
          );
        }
        keysAndButtons.push(keyCode);
      }
    }

    return keysAndButtons;
  }

  // removes all whitespace from a given string.
  private removeWhiteSpace(input: string) {
    return input.replace(/\s+/, "");
  }

  // replaces all consecutive instances of whitespace in a given string with one space.
  private stripWhiteSpace(input: string) {
    return input.replace(/\s+/, " ");
  }
}
