import { GatewayRequest, PlatformInterceptorBuilder, Result } from "@uniscale-sdk/ActorCharacter-Messagethreads";
import { Patterns } from "@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Account";
import { UserFull } from "@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Account/Account";
import axios, { AxiosResponse } from "axios";

export const accountInterceptors = async (forwardToServices: boolean, builder: PlatformInterceptorBuilder) => {
    // Pattern interceptor to send requests to the service over HTTP
    const serviceUrl = "https://uniscale-demo-messagethreads-account-service.azurewebsites.net/api/servicetomodule";
    builder.interceptPattern(
        Patterns.account.pattern,
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
        builder.interceptRequest(
            Patterns.account.getOrRegister.allRequestUsages,
            Patterns.account.getOrRegister.handleAsync(async (input, ctx) => {
                /** 
                 * Using the Uniscale SDK to implement a request interceptor handler In Uniscale the Result object is
                 * used to return responses. For a successful response the Ok method is used. For validation errors
                 * the Result.badRequest method is used and for other errors the Result.internalServerError method is
                 * used
                 * 
                 * The endpoint functionality to implement
                 * Continue to application
                 *   
                 *   The acceptance criteria defined for the flow is:
                 *     A user handle can only consist of characters and numbers
                 *     A user handle can not be empty
                 *   
                 *   The following existing class is used for input:: string
                 *   
                 *   The following existing class is used for output:
                 *   UniscaleDemo.Account.Account.UserFull
                 *     handle: string
                 *     userIdentifier: string
                 */
                return Result.ok(UserFull.samples().defaultSample());
            }))
        builder.interceptRequest(
            Patterns.account.lookupUsers.allRequestUsages,
            Patterns.account.lookupUsers.handleAsync(async (input, ctx) => {
                /** 
                 * Using the Uniscale SDK to implement a request interceptor handler In Uniscale the Result object is
                 * used to return responses. For a successful response the Ok method is used. For validation errors
                 * the Result.badRequest method is used and for other errors the Result.internalServerError method is
                 * used
                 * 
                 * The endpoint functionality to implement
                 * Search users by handle
                 *   
                 *   The following existing class is used for input:: string
                 *   
                 *   The following existing class is used for output:
                 *   UniscaleDemo.Account.Account.UserFull
                 *     handle: string
                 *     userIdentifier: string
                 */
                return Result.ok([UserFull.samples().defaultSample()]);
            }))
        builder.interceptRequest(
            Patterns.account.searchAllUsers.allRequestUsages,
            Patterns.account.searchAllUsers.handleAsync(async (input, ctx) => {
                /** 
                 * Using the Uniscale SDK to implement a request interceptor handler In Uniscale the Result object is
                 * used to return responses. For a successful response the Ok method is used. For validation errors
                 * the Result.badRequest method is used and for other errors the Result.internalServerError method is
                 * used
                 * 
                 * The endpoint functionality to implement
                 * Quick lookup
                 *   
                 *   The acceptance criteria defined for the flow is: If a user in the list is not found it will not be
                 *   part of the response
                 *   
                 *   The following existing class is used for input:: string[]
                 *   
                 *   The following existing class is used for output:
                 *   UniscaleDemo.Account.Account.UserFull
                 *     handle: string
                 *     userIdentifier: string
                 */
                return Result.ok([UserFull.samples().defaultSample()]);
            }))
    }
}