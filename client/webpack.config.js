module.exports = {
    // other webpack configurations...
    resolve: {
      fallback: {
        "http": false, // or require.resolve("stream-http")
        "https": false, // or require.resolve("https-browserify")
        "util": false, // or require.resolve("util/")
        "zlib": false, // or require.resolve("browserify-zlib")
        "stream": false, // or require.resolve("stream-browserify")
        "assert": false, // or require.resolve("assert/")
        "url": false // or require.resolve("url/")
      }
    }
  };  