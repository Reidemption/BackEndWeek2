const server = require("./server");
const persist = require("./presist");

const port = 8080;

persist.connect(() => {
  server.listen(port, () => {
    console.log("Code school forum mock Reddit app");
  });
});
