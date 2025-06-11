import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
const client = new SecretsManagerClient({
    region: "us-east-1",
});

async function getSecretJson(secretName) {
    if (secretName == 'CdkTodoAppStacktodoapppostg') return null
    let response;
    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
        console.error('Failed getting secrets')
        throw error;
    }
    return JSON.parse(response.SecretString)
}
export const DBSecret = await getSecretJson('CdkTodoAppStacktodoapppostg')
export const JWTSecret = await getSecretJson('jwt-signing-secret')
export const AESKeySecret = await getSecretJson('aes-256-cbc-key')