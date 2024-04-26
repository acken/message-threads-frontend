import { DispatcherSession, Platform } from "@uniscale-sdk/ActorCharacter-Messagethreads";
import { accountInterceptors } from "./service-endpoints/account-service";
import { messagesInterceptors } from "./service-endpoints/messages-service";

export class UniscaleSession {
    private static dispatcher: DispatcherSession
    private static useServices: boolean

    private constructor() { }

    public static configure(useServices: boolean): void {
        this.useServices = useServices
    }

    public static async getDispatcher(): Promise<DispatcherSession> {
        if (!UniscaleSession.dispatcher) {
            await this.initialize();
        }
        return UniscaleSession.dispatcher
    }

    private static async initialize(): Promise<void> {
        var session = await Platform.builder()
            .inspectRequests((input, ctx) => {
                console.log("Requesting: " + ctx.featureId, input)
            })
            .inspectResponses((output, input, ctx) => {
                if (!output.success) {
                    console.error("Error requesting: " + ctx.featureId, output.error)
                }
            })
            .withInterceptors(i => {
                accountInterceptors(this.useServices, i)
                messagesInterceptors(this.useServices, i)
            })
            .build();
        this.dispatcher = session.asSolution("fb344616-794e-4bd7-b81a-fb1e3361701f")
    }

}