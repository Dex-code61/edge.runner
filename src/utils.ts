import figlet from "figlet";


export function RenderFunnyText(){
    const body = figlet.textSync('Bun!'); 
    return body;
}