import { GatewayRequest, PlatformInterceptorBuilder, Result } from "@uniscale-sdk/ActorCharacter-Messagethreads";
import { Patterns } from "@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages";
import { MessageFull } from "@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages/Messages";
import axios, { AxiosResponse } from "axios";

export const messagesInterceptors = async (builder: PlatformInterceptorBuilder) => {
    const messages: MessageFull[] = []

    // Pattern interceptor to send requests to the service over HTTP
    const serviceUrl = "http://localhost:7071/api/ServiceToModule";
    builder.interceptPattern(
        Patterns.messages.pattern,
        async (input, ctx) => {
            const headers = { 'Content-Type': 'application/json' };
            const response = await axios.post<string,AxiosResponse<string>>(
                serviceUrl + "?featureId=" + ctx.featureId, 
                GatewayRequest.from(input, ctx).toJson(), 
                { headers }
            );
            return Result.fromJson(response.data);
        })

    // Mocked endpoints
    // Any endpoint that is defined here will not be sent to the service through the above
    // pattern interceptor. This is useful for mocking endpoints that are not defined in the
    // service yet.
    builder.interceptRequest(
        Patterns.messages.getDirectMessageList.allRequestUsages,
        Patterns.messages.getDirectMessageList.handleAsync(async (input, ctx) => {
            return Result.ok([MessageFull.samples().defaultSample()]);
        }))
    builder.interceptRequest(
        Patterns.messages.getMessageList.allRequestUsages,
        Patterns.messages.getMessageList.handleAsync(async (input, ctx) => {
            return Result.ok(messages);
        }))
    builder.interceptMessage(
        Patterns.messages.replyToDirectMessage.allMessageUsages,
        Patterns.messages.replyToDirectMessage.handleAsync(async (input, ctx) => {
            return Result.ok(undefined)
        }))
    builder.interceptMessage(
        Patterns.messages.sendDirectMessage.allMessageUsages,
        Patterns.messages.sendDirectMessage.handleAsync(async (input, ctx) => {
            return Result.ok(undefined)
        }))
    builder.interceptMessage(
        Patterns.messages.sendMessage.allMessageUsages,
        Patterns.messages.sendMessage.handleAsync(async (input, ctx) => {
            messages.push({
                created: {
                    at: new Date(),
                    by: input.by
                },
                message: input.message,
                messageIdentifier: '0a16a7d6-d528-465d-a2a6-55ff2bd3a62d'
            })
            return Result.ok(undefined)
        }))
}