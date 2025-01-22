// A generic class to manage a resource pool
class ResourcePool<T> {
  private resources: T[] = [];
  private maxSize: number;
  private factory: () => T;

  constructor(factory: () => T, maxSize: number) {
    this.factory = factory;
    this.maxSize = maxSize;
  }

  // Acquire a resource from the pool
  acquire(): T {
    if (this.resources.length > 0) {
      return this.resources.pop()!; // Return an existing resource
    }

    // If pool is empty but hasn't reached max size, create a new resource
    if (this.resources.length < this.maxSize) {
      return this.factory();
    }

    throw new Error("No resources available and pool has reached its maximum size");
  }

  // Release a resource back to the pool
  release(resource: T): void {
    if (this.resources.length < this.maxSize) {
      this.resources.push(resource); // Add the resource back to the pool
    } else {
      // If the pool is already full, discard the resource
      // You might implement custom cleanup logic here if necessary
    }
  }

  // Get the current size of the pool
  size(): number {
    return this.resources.length;
  }

  // Clear all resources from the pool
  clear(): void {
    this.resources.length = 0;
  }
}

// Example usage:
// Define a resource factory (e.g., creating objects or connections)
function createConnection(): { id: number } {
  return { id: Math.random() }; // A mock connection object
}

// Create a resource pool with a maximum size of 5
const connectionPool = new ResourcePool(createConnection, 5);

// Acquire a resource from the pool
const conn1 = connectionPool.acquire();
console.log("Acquired resource:", conn1);

// Release the resource back to the pool
connectionPool.release(conn1);
console.log("Pool size after release:", connectionPool.size());

// Attempt to acquire more resources than the pool can handle
try {
  const connections = Array.from({ length: 6 }, () => connectionPool.acquire());
  console.log("Connections:", connections);
} catch (err) {
  console.error(err.message);
}
