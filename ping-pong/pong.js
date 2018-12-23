const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
  __dirname + '/ping-pong.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const ppProto = protoDescriptor.pp;

const pong = function (call, callback) {
  console.log(`Pong server received: ${call.request.message}`)
  callback(null, {message: 'PING'});
};

main = function () {
  server = new grpc.Server();
  server.addService(ppProto.PongService.service, {
    Pong: pong
  });

  server.bind('0.0.0.0:50052', grpc.ServerCredentials.createInsecure());
  server.start();
}

async function sendPing() {
  const client = new ppProto.PongService('localhost:50053', grpc.credentials.createInsecure());

  grpc_promise.promisifyAll(client);

  let res = await client.Ping().sendMessage({message: 'PING'})

  console.log(`Pong server received: ${res.message}`)
}

main();
