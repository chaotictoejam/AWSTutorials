const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    const requestId = context.awsRequestId;
    await createMessage(requestId).then(() => {
        callback(null, {
            statusCode: 201,
            body: '',
            headers: {
                'Access-Control-Allow-Origin' : '*'
            }
        });
    }).catch((err) => {
        console.error(err)
    })
};

function createMessage(requestId) {
    const params = {
        TableName: 'Message',
        Item: {
            'messageId' : requestId,
            'message' : 'Hello from lambda'
        }
    }
    return ddb.put(params).promise();
}
