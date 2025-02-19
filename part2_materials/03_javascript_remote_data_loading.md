# API Calls with JavaScript

We'll look at three examples. The first is using the async/await syntax. This is the newest approach and provides a wrapper around the second, older promises approach relying on .then() chaining. The third approach will be using third party packages, namely ArcGIS JavaScript SDK and Leaflet.

Importantly, everything we'll consider here is intended to be executed in the browser. If you're working server-side, different approaches are available.

In a browser web inspector console, explore the following examples.

## Async/await
```
async function getMinnesotaStations() {
  try {
    const response = await fetch('https://api.weather.gov/stations?state=MN', {
      headers: {
        'User-Agent': '(myweatherapp.com, contact@myweatherapp.com)'
        // NWS API requires a User-Agent header identifying your application
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Minnesota Weather Stations:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Minnesota stations:', error);
  }
}
```

Call this function in the console `getMinnesotaStations()` and you'll note it first returns a promise and then resolves. See [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) for more on async functions.

## Promises via .then()
Promises are an older, less preferred approach because the code is less readable and the chaining with `.then()` functions is more likely for logic mistakes resulting in infinte callbacks.

```
function getMinnesotaStations() {
  fetch('https://api.weather.gov/stations?state=MN', {
    headers: {
      'User-Agent': '(myweatherapp.com, contact@myweatherapp.com)'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Minnesota Weather Stations:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching Minnesota stations:', error);
    });
} 
```

Similarly, call this function in your console. Note how it behaves differently. [Here's](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) more on promises and `.then()` syntax.

## Using Third Party Packages

### ArcGIS JavaScript SDK

### Leaflet

