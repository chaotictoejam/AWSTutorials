// Loads in the AWS SDK
const AWS = require('aws-sdk');

// Creates the document client specifing the region 
// The tutorial's table is 'in us-east-1'
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    // Captures the requestId from the context message
    const requestId = context.awsRequestId;
    if(event.name && event.email && event.message) {
        // Handle promise fulfilled/rejected states
        await createMessage(requestId, event).then(() => {
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
    } else {
        callback(null, {
            statusCode: 400,
            body: 'Bad Request',
            headers: {
                'Access-Control-Allow-Origin' : '*'
            }
        });
    }
};

// Function createMessage
// Writes message to DynamoDb table Message 
function createMessage(requestId, event) {
    
    const params = {
        TableName: 'Message',
        Item: {
            'messageId' : requestId,
            'name' : event.name,
            'email' : event.email,
            'message' : event.message
        }
    }

    return ddb.put(params).promise();
}
