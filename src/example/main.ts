


async function Start() {
    console.log("🚀 Starting the server...");
    await new Promise(r => setTimeout(r, 2000))
    console.log("✅ Server start successfull on port 3000");
}

Start()