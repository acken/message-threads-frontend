import { useState } from 'react';
import './App.css';
import { UniscaleSession } from './uniscale-session';
import { Empty, MessageFull } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages/Messages';
import { UserFull } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Account/Account';
import { GetOrRegister } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Account_1_0/Functionality/ServiceToModule/Account/Registration/ContinueToApplication';
import { GetMessageList } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages_1_0/Functionality/ServiceToModule/Messages/Timeline/ListMessages';
import { SendMessage } from '@uniscale-sdk/ActorCharacter-Messagethreads/sdk/UniscaleDemo/Messages_1_0/Functionality/ServiceToModule/Messages/Timeline/SendMessage';

function App() {
  const useServices = window.location.search.includes("services=yes")
  UniscaleSession.configure(useServices)

  const [messageResult, setMessageResult] = useState<MessageFull[]>([])
  const [userHandle, setUserHandle] = useState<string>("Test user")
  const [user, setUser] = useState<UserFull>()
  const [messageText, setMessageText] = useState<string>("")

  const register = async () => {
    const dispatcher = await UniscaleSession.getDispatcher()
    const result = await dispatcher.request(GetOrRegister.with(userHandle))
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
      setMessageText("")
      getMessages()
    }
  }

  return (
    <div className="App">
      {!user ?
        <p>
          Type user handle<br/>
          <input value={userHandle}  onChange={(e) => setUserHandle(e.target.value) } />
          <button onClick={async () => {
            register()
          }} >Register</button>
        </p> :
        <div>
          <p>
            Type message<br/>
            <input value={messageText}  onChange={(e) => setMessageText(e.target.value) } />
            <button onClick={async () => {
              sendMessage()
            }} >Add a message</button>
          </p>
          <div>
            Messages<br/>
            <div className="message">
              {
                messageResult.map((message) => {
                  return <div key={message.messageIdentifier}>{message.message}</div>
                })
              }
            </div>
          </div>
        </div>}
    </div>
  );
}

export default App;
