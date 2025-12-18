




async function Test() {
    console.log("Start testing...");
    await new Promise(r => setTimeout(r, 2000))
    console.log("⚙️ Test one passed 1");
    await new Promise(r => setTimeout(r, 500))
    console.log("⚙️ Test two passed 2");
    await new Promise(r => setTimeout(r, 1500))
    console.log("⚙️ Test three passed 3");
}

Test()