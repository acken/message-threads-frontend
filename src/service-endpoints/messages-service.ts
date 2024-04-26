import { GatewayRequest, PlatformInterceptorBuilder, Result } from "@uniscale-sdk/ActorCharacter-Messagethreads";
import { Patterns } from "@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages";
import { MessageFull } from "@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages/Messages";
import axios, { AxiosResponse } from "axios";
import { v4 as uuid } from "uuid";

export const messagesInterceptors = async (forwardToServices: boolean, builder: PlatformInterceptorBuilder) => {
    // Pattern interceptor to send requests to the service over HTTP
    const serviceUrl = "https://uniscale-demo-messagethreads-messages-service.azurewebsites.net/api/servicetomodule";
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
    if (!forwardToServices) {
        const messages: MessageFull[] = []

        builder.interceptRequest(
            Patterns.messages.getDirectMessageList.allRequestUsages,
            Patterns.messages.getDirectMessageList.handleAsync(async (input, ctx) => {
                /** 
                 * Using the Uniscale SDK to implement a request interceptor handler In Uniscale the Result object is
                 * used to return responses. For a successful response the Ok method is used. For validation errors
                 * the Result.badRequest method is used and for other errors the Result.internalServerError method is
                 * used
                 * 
                 * The endpoint functionality to implement
                 * List direct messages
                 *   
                 *   The acceptance criteria defined for the flow is:
                 *     You need to get the list of direct message for a user. You will then get both direct messages sent
                 *     to you and sent from you
                 *     Each direct message should contain a sorted list of replies where the oldest reply has the lowest
                 *     sort number
                 *   
                 *   # A reference to a user from the user service
                 *   The following existing class is used for input:: string
                 *   
                 *   The following existing class is used for output:
                 *   UniscaleDemo.Messages.Messages.DirectMessageFull[]
                 *     # A reference to a user from the user service
                 *     receiver: string
                 *     Created: UniscaleDemo.Messages.Messages.UserTag
                 *       at: Date
                 *       # A reference to a user from the user service
                 *       by: string
                 *     # Represents the message content in both timeline and direct messages
                 *     message: string
                 *     Replies: UniscaleDemo.Messages.Messages.DirectMessage_Replies[]
                 *       number: number
                 *       # Represents the message content in both timeline and direct messages
                 *       message: string
                 *       Created: UniscaleDemo.Messages.Messages.UserTag
                 *         at: Date
                 *         # A reference to a user from the user service
                 *         by: string
                 *     directMessageIdentifier: string
                 */
                return Result.ok([MessageFull.samples().defaultSample()]);
            }))
        builder.interceptRequest(
            Patterns.messages.getMessageList.allRequestUsages,
            Patterns.messages.getMessageList.handleAsync(async (input, ctx) => {
                /** 
                 * Using the Uniscale SDK to implement a request interceptor handler In Uniscale the Result object is
                 * used to return responses. For a successful response the Ok method is used. For validation errors
                 * the Result.badRequest method is used and for other errors the Result.internalServerError method is
                 * used
                 * 
                 * The endpoint functionality to implement
                 * List messages
                 *   
                 *   The acceptance criteria defined for the flow is: The message list should fetch the latest 50
                 *   messages from all users.
                 *   
                 *   The following existing class is used for input:
                 *   UniscaleDemo.Messages.Messages.Empty
                 *   
                 *   The following existing class is used for output:
                 *   UniscaleDemo.Messages.Messages.MessageFull
                 *     Created: UniscaleDemo.Messages.Messages.UserTag
                 *       at: Date
                 *       # A reference to a user from the user service
                 *       by: string
                 *     messageIdentifier: string
                 *     # Represents the message content in both timeline and direct messages
                 *     message: string
                 */
                return Result.ok(messages);
            }))
        builder.interceptMessage(
            Patterns.messages.replyToDirectMessage.allMessageUsages,
            Patterns.messages.replyToDirectMessage.handleAsync(async (input, ctx) => {
                /** 
                 * Using the Uniscale SDK to implement a request interceptor handler In Uniscale the Result object is
                 * used to return responses. For a successful response the Ok method is used. For validation errors
                 * the Result.badRequest method is used and for other errors the Result.internalServerError method is
                 * used
                 * 
                 * The endpoint functionality to implement
                 * Replying to a direct message
                 *   
                 *   The acceptance criteria defined for the flow is:
                 *     The source direct message you are replying to must be specified
                 *     The message must be between 3 and 60 characters long
                 *     You must specify the user identifier of the sender of the message
                 *   
                 *   The following existing class is used for input:
                 *   UniscaleDemo.Messages.Messages.ReplyToDirectMessageInput
                 *     # Represents the message content in both timeline and direct messages
                 *     message: string
                 *     # A reference to a user from the user service
                 *     by: string
                 *     directMessageIdentifier: string
                 * 
                 * The available error codes to return are:
                 *   ErrorCodes.Messages.ValidationError
                 *   ErrorCodes.Messages.InvalidMessageLength
                 */
                return Result.ok(undefined)
            }))
        builder.interceptMessage(
            Patterns.messages.sendDirectMessage.allMessageUsages,
            Patterns.messages.sendDirectMessage.handleAsync(async (input, ctx) => {
                /** 
                 * Using the Uniscale SDK to implement a request interceptor handler In Uniscale the Result object is
                 * used to return responses. For a successful response the Ok method is used. For validation errors
                 * the Result.badRequest method is used and for other errors the Result.internalServerError method is
                 * used
                 * 
                 * The endpoint functionality to implement
                 * Sending a new direct message
                 *   
                 *   The acceptance criteria defined for the flow is:
                 *     You must specify the user identifier of the sender of the message
                 *     The message must be between 3 and 60 characters long
                 *     The user identifier of the user you want to send the message to must be specified
                 *   
                 *   The following existing class is used for input:
                 *   UniscaleDemo.Messages.Messages.SendDirectMessageInput
                 *     # A reference to a user from the user service
                 *     receiver: string
                 *     # Represents the message content in both timeline and direct messages
                 *     message: string
                 *     # A reference to a user from the user service
                 *     by: string
                 * 
                 * The available error codes to return are:
                 *   ErrorCodes.Messages.ValidationError
                 *   ErrorCodes.Messages.InvalidMessageLength
                 */
                return Result.ok(undefined)
            }))
        builder.interceptMessage(
            Patterns.messages.sendMessage.allMessageUsages,
            Patterns.messages.sendMessage.handleAsync(async (input, ctx) => {
                /** 
                 * Using the Uniscale SDK to implement a request interceptor handler In Uniscale the Result object is
                 * used to return responses. For a successful response the Ok method is used. For validation errors
                 * the Result.badRequest method is used and for other errors the Result.internalServerError method is
                 * used
                 * 
                 * The endpoint functionality to implement
                 * Send message
                 *   
                 *   The acceptance criteria defined for the flow is:
                 *     When sending a message the message body must be between 3 and 60 characters
                 *     When sending a message the user identifier must be specified
                 *   
                 *   The following existing class is used for input:
                 *   UniscaleDemo.Messages.Messages.SendMessageInput
                 *     # A reference to a user from the user service
                 *     by: string
                 *     # Represents the message content in both timeline and direct messages
                 *     message: string
                 * 
                 * The available error codes to return are:
                 *   ErrorCodes.Messages.ValidationError
                 *   ErrorCodes.Messages.InvalidMessageLength
                 */
                messages.push({
                    messageIdentifier: uuid(),
                    message: input.message,
                    created: {
                        at: new Date(),
                        by: input.by
                    }
                })
                return Result.ok(undefined)
            }))
    }
}