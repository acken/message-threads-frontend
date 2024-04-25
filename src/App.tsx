/** 
 * Using the Uniscale SDK to call defined endpoints through a dispatcher session
 * Using the Uniscale dispatcher you can use the Request method in and pass an instance of a class based on the RequestResponseBackendAction
 * base class using the static .With method to set the input. What is passed into the .With. For the result class that comes back. If the Success property is true
 * it has succeeded and you will find the result is in the Value property. If the Success property is false it can use the .Error.Details.UserError
 * to get the error message. It should use the feature class directly as a static class when using the .With method.
 * 
 * Sign in or up
 *   This solutions has no access control. To start using the application the user should type a user
 *   handle. If the user handle have already been used they will enter the system as that user. If it is
 *   a new user handle the user will be created and they will continue into the application as this new
 *   user.
 *   
 *   There are 1 flows available in this use case:
 *     Continue to application
 *       
 *       Acceptance criteria:
 *         When clicking continue the application will navigate to the timeline view in the messages modules
 *         as the given user
 *         A user handle can only consist of characters and numbers
 *         A user handle can not be empty
 *   
 *   Endpoints available to implement the flow:
 *     UniscaleDemo.Account.Account.GetOrRegister
 *       The following existing class is used for input:: string
 *       The following existing class is used for output:
 *       UniscaleDemo.Account.Account.UserFull
 *         handle: string
 *         userIdentifier: string
 * 
 *
 */
import React, { useEffect, useState } from 'react';
import './App.css';
import { GetMessageList } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages_1_0/Functionality/ServiceToModule/Messages/Timeline/ListMessages';
import { Empty, MessageFull } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages/Messages';
import { UniscaleSession } from './uniscale-session';
import { SendMessage } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages_1_0/Functionality/ServiceToModule/Messages/Timeline/SendMessage';
import { GetOrRegister } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Account_1_0/Functionality/ServiceToModule/Account/Registration/ContinueToApplication';
import { UserFull } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Account/Account';

function App() {
  

  const [messageResult, setMessageResult] = useState<MessageFull[]>([])
  const [user, setUser] = useState<UserFull>()
  const [messageText, setMessageText] = useState<string>("")

  const register = async () => {
    const dispatcher = await UniscaleSession.getDispatcher()
    const result = await dispatcher.request(GetOrRegister.with("user1"))
    if (result.success) {
      setUser(result.value as UserFull)
    }
  }

  const getMessages = async () => {
    const dispatcher = await UniscaleSession.getDispatcher()
    const result = await dispatcher.request(GetMessageList.with(new Empty()))
    if (result.success) {
      setMessageResult(result.value as MessageFull[])
    }
  }

  const sendMessage = async () => {
    const dispatcher = await UniscaleSession.getDispatcher()
    const result = await dispatcher.request(SendMessage.with({
      message: messageText,
      by: user?.userIdentifier
    }))
    if (result.success) {
      getMessages()
    }
  }

  useEffect(() => { 
    getMessages();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {!user ?
          <div>
            <p>Type user handle</p>
            <button onClick={async () => {
              register()
            }} >Register</button>
          </div> :
          <div>
            <div>
              <p>Type message</p>
              <input type="messageText"  onChange={(e) => setMessageText(e.target.value) } />
              <button onClick={async () => {
                sendMessage()
              }} >Add a message</button>
            </div>
            <div>
              <p>Messages</p>
              <div>
                {
                  messageResult.map((message) => {
                    return <div key={message.messageIdentifier}>{message.message}</div>
                  })
                }
              </div>
            </div>
          </div>}
      </header>
    </div>
  );
}

export default App;
