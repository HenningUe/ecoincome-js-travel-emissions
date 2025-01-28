
function withContext<T, R>(resource: T, use: (resource: T) => R): R {
    try {
      return use(resource);
    } finally {
      if (typeof (resource as any)?.dispose === "function") {
        (resource as any).dispose(); // Ensure cleanup if `dispose` is defined
      }
    }
  }
  
  // Example usage:
  class Resource {
    doSomething() {
      console.log("Doing something...");
    }
    dispose() {
      console.log("Cleaning up...");
    }
  }