import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
 
const config = {
    region: "us-east-realengo-1",
    credentials: {
        accessKeyId: 'your_id',
        secretAccessKey: 'your_id'
    }
};

const client = new BedrockAgentRuntimeClient(config);

const input = {   
    agentId: "your_id",
    agentAliasId: "your_id",
    sessionId: "abc123",
    inputText: "quem e vc?",
};

const invokeAgent = async () => {
    try {
        let completion = "";
        const command = new InvokeAgentCommand(input);
        const response = await client.send(command);
        // Iterando sobre os eventos de chunk da resposta
        for await (const chunkEvent of response.completion) {
            if (chunkEvent.chunk) {
                const chunk = chunkEvent.chunk;
                // Decodificando o conteúdo bytes para UTF-8
                let decoded = new TextDecoder("utf-8").decode(chunk.bytes);
                completion += decoded;
            }
        }
        // Retornando a resposta completa e decodificada
        return {
            completion,
            response // Se precisar de mais detalhes da resposta completa
        };
    } catch (error) {
        console.error("Erro ao invocar agente:", error);
        throw error; // Lança o erro para ser capturado externamente
    }
};

// Utilizando a função invokeAgent com async/await
(async () => {
    try {
        const result = await invokeAgent();
        console.log("Resposta completa decodificada:", result.completion);
        // Aqui você pode acessar outras informações da resposta se necessário
        // console.log("Detalhes adicionais da resposta:", result.response);
    } catch (error) {
        console.error("Erro ao invocar agente:", error);
    }
})();


