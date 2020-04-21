// Loads in the AWS SDK
const AWS = require('aws-sdk');

// Creates the document client specifing the region 
// The tutorial's table is 'in us-east-1'
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    // Captures the requestId from the context message
    const requestId = context.awsRequestId;

    // Handle promise fulfilled/rejected states
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

// Function createMessage
// Writes message to DynamoDb table Message 
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
