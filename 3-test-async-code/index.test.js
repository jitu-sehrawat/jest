describe("callbacks", () => {
  function fetchData(callback) {
    setTimeout(() => {
      callback("peanut butter")
    }, 100);
  }

  // The problem is that the test will complete as soon as fetchData completes, before ever calling the callback.
  // There is an alternate form of test that fixes this. Instead of putting the test in a function with an empty argument,
  // use a single argument called done. Jest will wait until the done callback is called before finishing the test.

  // If done() is never called, the test will fail (with timeout error), which is what you want to happen
  test('the data is peanut butter', (done) => {
    function callback(data) {
      try {
        expect(data).toBe('peanut butter');
        done();
      } catch (error) {
        done(error);
      }
    }

    fetchData(callback);
  });
})

describe("promises", () => {
  // If your code uses promises, there is a more straightforward way to handle asynchronous tests. Return a promise from your test,
  // and Jest will wait for that promise to resolve. If the promise is rejected, the test will automatically fail.

  function fetchData(callback) {
    return new Promise((resolve, reject) => {
      if (callback > 0) {
        resolve("peanut butter")
      } else {
        reject(Error)
      }
    })
  }

  test('Method 1: the data is peanut butter', () => {
    // Be sure to return the promise - if you omit this return statement, your test will complete before
    // the promise returned from fetchData resolves and then() has a chance to execute the callback
    return fetchData(1).then(data => {
      expect(data).toBe('peanut butter');
    });
  });
  test('Method 2: the data is peanut butter', () => {
    return expect(fetchData(1)).resolves.toBe('peanut butter');
  });

  // If you expect a promise to be rejected, use the .catch method. Make sure to add expect.assertions to verify that
  // a certain number of assertions are called. Otherwise, a fulfilled promise would not fail the test.
  test('Method 1: the fetch fails with an error', () => {
    // expect.assertions(1);
    return fetchData(0).catch(e => expect(e).toEqual(Error));
  });
  test('Method 2: the fetch fails with an error', () => {
    return expect(fetchData(0)).rejects.toEqual(Error);
  });
})

describe("Async/Await", () => {
  async function fetchData(callback) {
    return new Promise((resolve, reject) => {
      if (callback > 0) {
        resolve("peanut butter")
      } else {
        reject(Error)
      }
    })
  }

  // Alternatively, you can use async and await in your tests. To write an async test, use the async keyword in
  // front of the function passed to test. For example, the same fetchData scenario can be tested with
  test('Method 1: the data is peanut butter', async () => {
    const data = await fetchData(1);
    expect(data).toBe('peanut butter');
  });

  test('Method 1: the fetch fails with an error', async () => {
    expect.assertions(1);
    try {
      await fetchData();
    } catch (e) {
      expect(e).toEqual(Error);
    }
  });

  // You can combine async and await with .resolves or .rejects.
  test('Method 2: the data is peanut butter', async () => {
    await expect(fetchData(1)).resolves.toBe('peanut butter');
  });
  
  test('Method 2: the fetch fails with an error', async () => {
    await expect(fetchData()).rejects.toEqual(Error);
  });
})