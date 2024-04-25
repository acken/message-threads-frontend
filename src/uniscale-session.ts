import { DispatcherSession, FeatureContext, Platform, Result } from "@uniscale-sdk/ActorCharacter-Messagethreads";
import { accountInterceptors } from "./mocked-endpoints/account-service";
import { messagesInterceptors } from "./mocked-endpoints/messages-service";

export class UniscaleSession {
    private static dispatcher: DispatcherSession

    private constructor() { }

    public static async getDispatcher(): Promise<DispatcherSession> {
        if (!UniscaleSession.dispatcher) {
            await this.initialize();
        }
        return UniscaleSession.dispatcher
    }

    private static async initialize(): Promise<void> {
        var session = await Platform.builder()
            .inspectRequests((input, ctx) => {
                console.log("Requesting: " + ctx.featureId)
            })
            .inspectResponses((output, input, ctx) => {
                if (!output.success) {
                    console.error("Error requesting: " + ctx.featureId, output.error)
                }
            })
            .withInterceptors(i => {
                accountInterceptors(i)
                messagesInterceptors(i)
            })
            .build();
        this.dispatcher = session.asSolution("fb344616-794e-4bd7-b81a-fb1e3361701f")
    }

}