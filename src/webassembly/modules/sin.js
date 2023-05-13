// Fetch and instantiate the WASM module
fetch('wasm/sine.wasm')
    .then(response => response.arrayBuffer())
    .then(bytes => WebAssembly.instantiate(bytes, { env: { memory } }))
    .then(instance => {
        // The WASM module
        const wasmModule = instance.instance.exports;

        // The WASM memory
        const memory = new WebAssembly.Memory({ initial: 1 }); // 1 page of memory = 64KiB
        const memoryArray = new Float32Array(memory.buffer);

        // The input array
        const inputArray = new Float32Array([0.1, 0.2, 0.3, 0.4]);

        // Copy the input array to memory
        memoryArray.set(inputArray, 0);

        // Call the WASM function
        const resultPointer = wasmModule.doubleArray(0, inputArray.length);

        // Read the result array from memory
        const resultArray = memoryArray.slice(resultPointer, resultPointer + inputArray.length);

        // Copy the result array to a new JavaScript array
        const result = Array.from(resultArray);

        console.log(result); // The result array
    })
    .catch(console.error);

