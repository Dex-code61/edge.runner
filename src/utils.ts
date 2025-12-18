import figlet from "figlet";


export function RenderFunnyText(t: string){
    const body = figlet.textSync(t); 
    return body;
}

export function createControlledPromise() {
    let resolve: (value?: unknown) => void;
    let reject: (reason?: any) => void;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
  }