const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const grpc_promise = require('grpc-promise');;

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

const ping = function (call, callback) {
  console.log(`Ping server received: ${call.request.message}`)
  callback(null, {message: 'PONG'});
};

main = function () {
  server = new grpc.Server();
  server.addService(ppProto.PingService.service, {
    Ping: ping
  });

  server.bind('0.0.0.0:50053', grpc.ServerCredentials.createInsecure());
  server.start();
}

async function sendPong() {
  const client = new ppProto.PongService('localhost:50052', grpc.credentials.createInsecure());

  grpc_promise.promisifyAll(client);

  let res = await client.Pong().sendMessage({message: 'PONG'})

  console.log(`Ping server received: ${res.message}`)
}

main()
sendPong()
