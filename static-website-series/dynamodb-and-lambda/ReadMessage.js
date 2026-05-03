// Import the DynamoDB client from AWS SDK v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create the DynamoDB client
const client = new DynamoDBClient({ region: 'us-east-1' });

// Create the DynamoDB document client
const ddbDocClient = DynamoDBDocumentClient.from(client); 

export const handler = async (event, context) => {
    try {
        const data = await readMessage();
        
        // Log each message
        data.Items.forEach(item => console.log(item.message));

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while reading messages' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};

// Function readMessage
// Reads 10 messages from the DynamoDb table Message
async function readMessage() {
    const params = {
        TableName: 'Message',
        Limit: 10
    };
    
    const command = new ScanCommand(params);
    return ddbDocClient.send(command);
}