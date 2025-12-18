


async function Build() {
    console.log("Start Building...");
    await new Promise(r => setTimeout(r, 3000))
    console.log("🏡 Running typescript...");
    await new Promise(r => setTimeout(r, 1000))
    console.log("🏡 Generate pages...");
    await new Promise(r => setTimeout(r, 2000))
    console.log("🏡 Collecting build traces..");
}

Build()