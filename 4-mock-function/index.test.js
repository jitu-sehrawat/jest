describe("Using a mock function", () => {
  function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
      callback(items[index]);
    }
  }

  test("jest.fn()", () => {
    const mockCallback = jest.fn(x => 42 + x);
    forEach([0, 1], mockCallback);

    // The mock function is called twice
    expect(mockCallback.mock.calls.length).toBe(2);

    // The first argument of the first call to the function was 0
    expect(mockCallback.mock.calls[0][0]).toBe(0);

    // The first argument of the second call to the function was 1
    expect(mockCallback.mock.calls[1][0]).toBe(1);

    // The return value of the first call to the function was 42
    expect(mockCallback.mock.results[0].value).toBe(42);
  })
})

describe("Mock Return Values", () => {
  test("mockReturnValueOnce and mockReturnValue", () => {
    const filterTestFn = jest.fn();

    // Make the mock return `true` for the first call,
    // and `false` for the second call
    filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValue(true);

    const result = [11, 12, 13, 14].filter(num => filterTestFn(num));

    expect(filterTestFn.mock.results[0].value).toBeTruthy();
    expect(filterTestFn.mock.results[1].value).toBeFalsy();
    expect(filterTestFn.mock.results[2].value).toBeTruthy();
    expect(filterTestFn.mock.results[3].value).toBeTruthy();
  })
})

describe("mockResolvedValue() or mockImplementation()", () => {
  // Suppose we have a class that fetches users from our API. The class uses axios to call the API then returns
  // the data attribute which contains all the users

  // Now, in order to test this method without actually hitting the API (and thus creating slow and fragile tests),
  // we can use the jest.mock(...) function to automatically mock the axios module.

  // Once we mock the module we can provide a mockResolvedValue for .get that returns the data
  // we want our test to assert against. In effect, we are saying that we want axios.get('/users.json') to return a fake response

  const axios = require("axios");
  const { Users } = require('./users');

  jest.mock('axios');

  test('should fetch users', async () => {
    const users = [{ name: 'Bob' }];
    const resp = { data: users };

    axios.get.mockResolvedValue(resp);
    // or you could use the following depending on your use case:
    // axios.get.mockImplementation(() => Promise.resolve(resp))

    await expect(Users.all()).resolves.toEqual(users);
    // OR
    // return Users.all().then(data => expect(data).toEqual(users));
  });
})

describe("Mocking Partials", () => {
  // Subsets of a module can be mocked and the rest of the module can keep their actual implementation
  const { bar, foo, something } = require("./foo-bar-baz");
  jest.mock('./foo-bar-baz', () => {
    const originalModule = jest.requireActual('./foo-bar-baz');

    //Mock the something() and named export 'foo'
    return {
      __esModule: true,
      ...originalModule,
      something: jest.fn(() => 'mocked something'),
      foo: 'mocked foo',
    };
  });

  test('should do a partial mock', () => {
    const somethingResult = something();
    expect(somethingResult).toBe('mocked something');
    expect(something).toHaveBeenCalled();

    expect(foo).toBe('mocked foo');
    expect(bar()).toBe('bar');
  });
})