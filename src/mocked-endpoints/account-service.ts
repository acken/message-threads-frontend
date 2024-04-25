import { GatewayRequest, PlatformInterceptorBuilder, Result } from "@uniscale-sdk/ActorCharacter-Messagethreads";
import { Patterns } from "@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Account";
import { UserFull } from "@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Account/Account";
import axios, { AxiosResponse } from "axios";

export const accountInterceptors = async (forwardToServices: boolean, builder: PlatformInterceptorBuilder) => {
    // Pattern interceptor to send requests to the service over HTTP
    const serviceUrl = "http://localhost:3000/api/ServiceToModule";
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
    if (forwardToServices) {
        builder.interceptRequest(
            Patterns.account.getOrRegister.allRequestUsages,
            Patterns.account.getOrRegister.handleAsync(async (input, ctx) => {
                return Result.ok(UserFull.samples().defaultSample());
            }))
        builder.interceptRequest(
            Patterns.account.lookupUsers.allRequestUsages,
            Patterns.account.lookupUsers.handleAsync(async (input, ctx) => {
                return Result.ok([UserFull.samples().defaultSample()]);
            }))
        builder.interceptRequest(
            Patterns.account.searchAllUsers.allRequestUsages,
            Patterns.account.searchAllUsers.handleAsync(async (input, ctx) => {
                return Result.ok([UserFull.samples().defaultSample()]);
            }))
    }
}